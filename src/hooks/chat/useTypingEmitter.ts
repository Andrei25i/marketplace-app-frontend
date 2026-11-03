import { useCallback, useEffect, useRef } from "react";
import { socket } from "@/realtime/socket";

const TYPING_REFRESH_MS = 2500;
const TYPING_IDLE_MS = 3000;
const RECORDING_REFRESH_MS = 2500;

const useTypingEmitter = (conversationId: string) => {
  const isTypingRef = useRef(false);
  const lastSentAtRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTyping = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;

    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    lastSentAtRef.current = 0;

    socket.volatile.emit("typing", { conversationId, isTyping: false });
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    const now = Date.now();

    if (
      !isTypingRef.current ||
      now - lastSentAtRef.current >= TYPING_REFRESH_MS
    ) {
      socket.volatile.emit("typing", { conversationId, isTyping: true });
      isTypingRef.current = true;
      lastSentAtRef.current = now;
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  }, [conversationId, stopTyping]);

  const markSent = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
    isTypingRef.current = false;
    lastSentAtRef.current = 0;
  }, []);

  const sendFailed = useCallback(() => {
    socket.volatile.emit("typing", { conversationId, isTyping: false });
  }, [conversationId]);

  const startRecording = useCallback(() => {
    markSent();
    if (recordingTimerRef.current) return;

    const emit = () =>
      socket.volatile.emit("typing", {
        conversationId,
        isTyping: true,
        kind: "recording",
      });

    emit();
    recordingTimerRef.current = setInterval(emit, RECORDING_REFRESH_MS);
  }, [conversationId, markSent]);

  const stopRecording = useCallback(() => {
    if (!recordingTimerRef.current) return;
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;

    socket.volatile.emit("typing", {
      conversationId,
      isTyping: false,
      kind: "recording",
    });
  }, [conversationId]);

  useEffect(
    () => () => {
      stopTyping();
      stopRecording();
    },
    [stopTyping, stopRecording],
  );

  return {
    notifyTyping,
    stopTyping,
    markSent,
    sendFailed,
    startRecording,
    stopRecording,
  };
};

export default useTypingEmitter;
