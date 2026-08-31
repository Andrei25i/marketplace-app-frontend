import type { AdDTO } from "./ads.type";
import type { CategoryDTO } from "./category.type";

export type FavoriteAdDTO = AdDTO & {
  favorited_ad?: string;
  category?: CategoryDTO;
};

export type FavoriteAdsState = {
  favoriteIds: string[];
  isLoaded: boolean;

  isFavorite: (adId: string) => boolean;
  syncFavorites: () => Promise<void>;
  toggleFavorite: (adId: string) => Promise<boolean>;
  clearFavorites: () => void;
};
