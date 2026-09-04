import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useFavoriteAdsStore } from "./store/useFavoriteStore";
import { useEffect } from "react";

function App() {
  const syncFavorites = useFavoriteAdsStore((state) => state.syncFavorites);

  useEffect(() => {
    void syncFavorites();
  }, [syncFavorites]);

  return <RouterProvider router={router} />;
}

export default App;
