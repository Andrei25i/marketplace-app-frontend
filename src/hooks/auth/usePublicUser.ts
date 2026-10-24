import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useQuery } from "@tanstack/react-query";

const usePublicUser = (id?: string) => {
  const query = useQuery({
    queryKey: ["publicUser", id],
    queryFn: () => authService.getPublicUser(id as string),
    enabled: Boolean(id),
  });

  let error = "";
  if (!id) {
    error = "Utilizator invalid.";
  } else if (query.error) {
    error = getErrorMessage(query.error, "Nu s-a putut încărca profilul.");
  }

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    error,
    refetch: query.refetch,
  };
};

export default usePublicUser;
