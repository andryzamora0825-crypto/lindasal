export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: "comestible" | "belleza" | "terapeutica" | "combos" | string;
  brand?: "LINDASAL" | "AGUADEMAR QUINTON" | "NAVELLA" | string;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  discount_percentage?: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
