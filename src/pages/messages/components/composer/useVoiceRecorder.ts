import { useCallback, useEffect, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import type { VoiceRecording } from "@/types/chat.type";
import { MAX_VOICE_MS, MIN_VOICE_MS } from "@/utils/chat.util";

const MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/webm",
];

const pickMimeType = () =>
  MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));

const extensionFor = (type: string) =>
  type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";

const micErrorMessage = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Permite accesul la microfon din setările browserului.";
  if (name === "NotFoundError") return "Nu am găsit niciun microfon.";
  if (name === "NotReadableError")
    return "Microfonul este folosit de altă aplicație.";
  return "Nu am putut porni înregistrarea.";
};

const notifyError = (message: string) =>
  notifications.show({ color: "red", title: "Microfon indisponibil", message });

export type RecorderStatus = "idle" | "starting" | "recording";

const useVoiceRecorder = (
  onLimitReached: (voice: VoiceRecording | null) => void,
) => {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef(false);
  const sessionRef = useRef(0);

  const limitRef = useRef(onLimitReached);
  useEffect(() => {
    limitRef.current = onLimitReached;
  });

  const stopTimer = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const release = useCallback(() => {
    stopTimer();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setStatus("idle");
    setElapsedMs(0);
  }, []);

  const stop = useCallback((): Promise<VoiceRecording | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      release();
      return Promise.resolve(null);
    }

    recorderRef.current = null;
    stopTimer();
    const durationMs = Math.min(
      Date.now() - startedAtRef.current,
      MAX_VOICE_MS,
    );

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType.split(";")[0] || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        release();

        if (durationMs < MIN_VOICE_MS || blob.size === 0) {
          resolve(null);
          return;
        }

        resolve({
          file: new File([blob], `voice.${extensionFor(type)}`, { type }),
          durationMs,
        });
      };
      recorder.stop();
    });
  }, [release]);

  const start = useCallback(async (): Promise<boolean> => {
    if (pendingRef.current || streamRef.current) return false;

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      notifyError("Browserul tău nu permite înregistrarea audio.");
      return false;
    }

    pendingRef.current = true;
    setStatus("starting");
    const session = sessionRef.current;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      pendingRef.current = false;
      setStatus("idle");
      notifyError(micErrorMessage(error));
      return false;
    }
    pendingRef.current = false;

    if (session !== sessionRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      return false;
    }

    let recorder: MediaRecorder;
    try {
      const mimeType = pickMimeType();
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (error) {
      stream.getTracks().forEach((track) => track.stop());
      setStatus("idle");
      notifyError(micErrorMessage(error));
      return false;
    }

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.start();

    streamRef.current = stream;
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setStatus("recording");

    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      setElapsedMs(elapsed);
      if (elapsed >= MAX_VOICE_MS) {
        void stop().then((voice) => limitRef.current(voice));
      }
    }, 200);

    return true;
  }, [stop]);

  const cancel = useCallback(() => {
    sessionRef.current += 1;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.stop();
    }
    release();
  }, [release]);

  useEffect(() => cancel, [cancel]);

  return { status, elapsedMs, start, stop, cancel };
};

export default useVoiceRecorder;
