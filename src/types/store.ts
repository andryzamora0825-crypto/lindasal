export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: "comestible" | "belleza" | "terapeutica" | "combos" | string;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
