import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

const SESSIONS_KEY = ["sessions"];

export const useActiveSessions = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });

  const sessionsQuery = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: authService.getSessions,
  });

  const revokeOne = useMutation({
    mutationFn: authService.revokeSession,
    onSuccess: invalidate,
  });

  const revokeOthers = useMutation({
    mutationFn: authService.revokeOtherSessions,
    onSuccess: invalidate,
  });

  return { sessionsQuery, revokeOne, revokeOthers };
};
