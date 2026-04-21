export type MaterialId =
  | "carbon-steel"
  | "stainless-steel"
  | "alloy-steel"
  | "cast-iron"
  | "non-ferrous";

export type PurposeId =
  | "oil-gas"
  | "construction"
  | "mechanical"
  | "electrical"
  | "industrial";

export type Locale = "ru" | "uz";

export interface LocalizedString {
  ru: string;
  uz: string;
}

export interface Product {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  categoryId: string;
  productType: LocalizedString;
  materials: MaterialId[];
  purposes: PurposeId[];
  standards: string[];
  image: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  icon: string;
  image: string;
  order: number;
}

export interface CatalogFilters {
  category: string | null;
  productType: string | null;
  material: MaterialId | null;
  purpose: PurposeId | null;
  search: string;
}
