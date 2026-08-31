import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { notifications } from "@mantine/notifications";

const ProtectedRoute = () => {
  const { isAuthenticated, logout } = useAuthStore();

  let hasStoredSession = false;

  try {
    const storedAuth = localStorage.getItem("auth-storage");

    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      hasStoredSession = Boolean(parsedAuth.state?.token);
    }
  } catch {
    hasStoredSession = false;
  }

  if (!isAuthenticated || !hasStoredSession) {
    if (isAuthenticated && !hasStoredSession) {
      logout();
    }

    notifications.show({
      title: "Autentificare necesară",
      message: "Această acțiune necesită autentificare.",
      color: "yellow",
    });

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
