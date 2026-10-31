import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "./chatKeys";
import { chatService } from "@/services/chat.service";
import { shouldRefetchOnFocus } from "@/realtime/socket";

const useUnreadCount = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: chatKeys.unread(),
    queryFn: chatService.getUnreadCount,
    enabled: isAuthenticated,
    refetchOnWindowFocus: shouldRefetchOnFocus,
    staleTime: 30_000,
  });

  return {
    unreadCount: isAuthenticated ? (query.data ?? 0) : 0,
  };
};

export default useUnreadCount;
