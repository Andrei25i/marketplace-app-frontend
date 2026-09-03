import type { CategoryDTO } from "./category.type";

export type AdSortOption =
  | "price_asc"
  | "price_desc"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

export const AD_SORT_OPTIONS = [
  { value: "price_asc", label: "Preț: crescător" },
  { value: "price_desc", label: "Preț: descrescător" },
  { value: "date_asc", label: "Cele mai vechi" },
  { value: "date_desc", label: "Adăugate recent" },
  { value: "name_asc", label: "Nume: A-Z" },
  { value: "name_desc", label: "Nume: Z-A" },
] as const satisfies ReadonlyArray<{
  value: AdSortOption;
  label: string;
}>;

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

export type DeleteAdResponse = {
  message: string;
};

export type AdUserDTO = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export type AdDetailsDTO = Omit<AdDTO, "category_id" | "user_id"> & {
  category: CategoryDTO;
  user: AdUserDTO;
};
