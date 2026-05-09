export type Status = "paid" | "pending" | "cancelled";
export type Tab = "dashboard" | "sales" | "products" | "clients";

export interface Sale {
  id: string;
  date: string;
  product: string;
  productId: string;
  client: string;
  clientId: string;
  quantity: number;
  price: number;
  total: number;
  status: Status;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  color: string;
}

export interface DB {
  sales: Sale[];
  products: Product[];
  clients: Client[];
}
