import { authService } from "@/services/auth.service";
import type { PublicUser } from "@/types/auth.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useState } from "react";

const usePublicUser = (id?: string) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = useCallback(async () => {
    if (!id) {
      setError("Utilizator invalid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await authService.getPublicUser(id);
      setUser(data);
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-a putut încărca profilul."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
};

export default usePublicUser;
