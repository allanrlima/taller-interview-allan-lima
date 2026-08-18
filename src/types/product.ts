export type ProductCategory = "Accessories" | "Audio" | "Computers" | "Home";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  category: ProductCategory;
  imageUrl: string;
  rating: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProductSort = "featured" | "name" | "price-asc" | "price-desc";
