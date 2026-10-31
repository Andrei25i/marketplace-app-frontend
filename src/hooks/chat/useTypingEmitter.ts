import { useCallback, useEffect, useRef } from "react";
import { socket } from "@/realtime/socket";

const TYPING_REFRESH_MS = 2500;
const TYPING_IDLE_MS = 3000;

const useTypingEmitter = (conversationId: string) => {
  const isTypingRef = useRef(false);
  const lastSentAtRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => stopTyping, [stopTyping]);

  return { notifyTyping, stopTyping, markSent, sendFailed };
};

export default useTypingEmitter;
