import { COLORS } from "../constants";
import { Client, DB, Product, Sale, Status } from "../types";
import { uid } from "./helpers";

export function buildSeedData(): DB {
  const clientNames = [
    "Ana Silva",
    "Carlos Mendes",
    "Julia Costa",
    "Pedro Alves",
    "Mariana Rocha",
    "Rafael Lima",
    "Fernanda Gomes",
    "Bruno Souza",
  ];
  const clients: Client[] = clientNames.map((name, i) => ({
    id: uid(),
    name,
    email: name.toLowerCase().replace(" ", ".") + "@mail.com",
    phone: `+55 11 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    totalPurchases: 0,
    color: COLORS[i % COLORS.length],
  }));

  const productDefs: [string, string, number][] = [
    ["iPhone 15", "Electronics", 4299],
    ["Nike Air Max", "Clothing", 699],
    ["Notebook Dell", "Electronics", 3199],
    ["Camiseta Polo", "Clothing", 129],
    ["Fone JBL", "Electronics", 399],
    ["Tênis Adidas", "Clothing", 459],
    ["Mesa Smart", "Home", 899],
    ["Cafeteira", "Home", 319],
  ];
  const products: Product[] = productDefs.map(([name, category, price], i) => ({
    id: uid(),
    name,
    category,
    price,
    stock: Math.floor(5 + Math.random() * 95),
    color: COLORS[i % COLORS.length],
  }));

  const sales: Sale[] = [];
  for (let i = 0; i < 28; i++) {
    const prod = products[Math.floor(Math.random() * products.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const qty = Math.floor(1 + Math.random() * 4);
    const month = String(Math.floor(1 + Math.random() * 6)).padStart(2, "0");
    const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, "0");
    const status = (
      ["paid", "paid", "paid", "pending", "cancelled"] as Status[]
    )[Math.floor(Math.random() * 5)];
    const total = qty * prod.price;
    sales.push({
      id: uid(),
      date: `2025-${month}-${day}`,
      product: prod.name,
      productId: prod.id,
      client: client.name,
      clientId: client.id,
      quantity: qty,
      price: prod.price,
      total,
      status,
    });
    if (status === "paid") client.totalPurchases += total;
  }

  return { sales, products, clients };
}
