import type { ChatMessage } from "@/types/chat.type";
import { isOwnMessage } from "@/utils/chat.util";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD_PX = 80;
const TOP_THRESHOLD_PX = 150;

type UseChatScrollOptions = {
  messages: ChatMessage[];
  userId: string | number | null | undefined;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  loadOlder: () => void;
};

const useChatScroll = ({
  messages,
  userId,
  hasOlder,
  isLoadingOlder,
  loadOlder,
}: UseChatScrollOptions) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [seenLastId, setSeenLastId] = useState<string | null>(null);

  const initializedRef = useRef(false);
  const firstIdRef = useRef<string | null>(null);
  const lastIdRef = useRef<string | null>(null);
  const heightBeforeOlderRef = useRef<number | null>(null);
  const wasLoadingOlderRef = useRef(false);

  const requestOlder = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !hasOlder || isLoadingOlder) return;
    if (heightBeforeOlderRef.current !== null) return;

    heightBeforeOlderRef.current = viewport.scrollHeight;
    loadOlder();
  }, [hasOlder, isLoadingOlder, loadOlder]);

  const onScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    const atBottom = distanceFromBottom < BOTTOM_THRESHOLD_PX;

    setIsAtBottom(atBottom);
    if (atBottom) setSeenLastId(lastIdRef.current);

    if (viewport.scrollTop < TOP_THRESHOLD_PX) requestOlder();
  }, [requestOlder]);

  const scrollToBottom = useCallback(() => {
    const viewport = viewportRef.current;
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const first = messages[0];
    const last = messages.at(-1);
    if (!viewport || !first || !last) return;

    if (!initializedRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
      initializedRef.current = true;
    } else if (
      heightBeforeOlderRef.current !== null &&
      first.id !== firstIdRef.current
    ) {
      viewport.scrollTop +=
        viewport.scrollHeight - heightBeforeOlderRef.current;
      heightBeforeOlderRef.current = null;
    } else if (
      last.id !== lastIdRef.current &&
      (isAtBottom || isOwnMessage(last, userId))
    ) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }

    if (wasLoadingOlderRef.current && !isLoadingOlder) {
      heightBeforeOlderRef.current = null;
    }
    wasLoadingOlderRef.current = isLoadingOlder;

    firstIdRef.current = first.id;
    lastIdRef.current = last.id;

    if (viewport.scrollHeight <= viewport.clientHeight + TOP_THRESHOLD_PX) {
      requestOlder();
    }
  }, [messages, isAtBottom, isLoadingOlder, userId, requestOlder]);

  const lastMessage = messages.at(-1);
  const hasNewBelow =
    !isAtBottom &&
    lastMessage !== undefined &&
    lastMessage.id !== seenLastId &&
    !isOwnMessage(lastMessage, userId);

  return { viewportRef, onScroll, isAtBottom, hasNewBelow, scrollToBottom };
};

export default useChatScroll;
