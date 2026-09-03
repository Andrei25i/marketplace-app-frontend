import type { AdDTO } from "./ads.type";
import type { CategoryDTO } from "./category.type";

export type FavoriteAdDTO = AdDTO & {
  favorited_at?: string;
  category?: CategoryDTO;
};

export interface FavoriteItem {
  user_id: string;
  ad_id: string;
  created_at?: string;
}

export interface AddFavoriteResponse {
  message: string;
  favorite: FavoriteItem;
}

export interface RemoveFavoriteResponse {
  message: string;
  deletedFavorite: {
    count: number;
  };
}

export type FavoriteAdsState = {
  favoriteIds: string[];
  isLoaded: boolean;

  isFavorite: (adId: string) => boolean;
  syncFavorites: () => Promise<void>;
  toggleFavorite: (adId: string) => Promise<boolean>;
  clearFavorites: () => void;
};
