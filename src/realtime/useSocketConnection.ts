import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { resetSocketState, socket } from "./socket";

const useSocketConnection = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    socket.connect();

    return () => {
      socket.disconnect();
      resetSocketState();
    };
  }, [isAuthenticated]);
};

export default useSocketConnection;
