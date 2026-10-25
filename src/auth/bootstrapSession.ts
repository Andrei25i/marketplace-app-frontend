import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoriteAdsStore } from "@/store/useFavoriteStore";
import { subscribeAuthMessages } from "./authChannel";

let started = false;

export const bootstrapSession = () => {
  if (started) return;
  started = true;

  subscribeAuthMessages((message) => {
    const store = useAuthStore.getState();

    switch (message.type) {
      case "logout":
        store.logout({ broadcast: false });
        break;
      case "login":
        store.login(message.user, { broadcast: false });
        break;
      case "user-updated":
        store.setUpdatedUser(message.user, { broadcast: false });
        break;
    }
  });

  if (!useAuthStore.getState().user) {
    useFavoriteAdsStore.getState().clearFavorites();
    return;
  }

  authService
    .refreshUser()
    .then(() => useFavoriteAdsStore.getState().syncFavorites())
    .catch(() => {});
};
