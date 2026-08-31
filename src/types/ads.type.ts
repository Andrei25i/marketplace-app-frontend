export type AdSortOption =
  | "price_asc"
  | "price_desc"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

export type GetAdsFilters = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  city?: string;
  userId?: string;
  sort?: AdSortOption;
};

export type AdImage = {
  url?: string;
  public_id?: string;
};

export type AdDTO = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: AdImage[];
  category_id: number;
  city: string;
  user_id: string;
  created_at: string;
};

export type CreateAdDTO = {
  title: string;
  description: string;
  price: number | string;
  currency?: string;
  images: AdImage[];
  category_id: number | string;
  city: string;
};

export type UpdateAdDTO = CreateAdDTO & {
  deletedPublicIds?: string[];
};
