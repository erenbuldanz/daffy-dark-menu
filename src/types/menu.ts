export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  options?: {
    name: string;
    choices: string[];
    maxSelect?: number;
  }[];
}

export type Category = string;

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string[]>;
  note?: string;
}
