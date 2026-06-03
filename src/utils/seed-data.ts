import { COLORS } from "../constants";
import { Client, DB, Product, Sale, Status } from "../types";
import { uid } from "./helpers";

export type Language = "pt" | "en" | "es-AR";

interface MultilingualText {
  pt: string;
  en: string;
  esAR: string;
}

const PRODUCT_NAMES: Record<string, MultilingualText> = {
  iphone: {
    pt: "iPhone 15",
    en: "iPhone 15",
    esAR: "iPhone 15",
  },
  nike: {
    pt: "Nike Air Max",
    en: "Nike Air Max",
    esAR: "Nike Air Max",
  },
  notebook: {
    pt: "Notebook Dell",
    en: "Dell Notebook",
    esAR: "Notebook Dell",
  },
  polo: {
    pt: "Camiseta Polo",
    en: "Polo Shirt",
    esAR: "Camiseta Polo",
  },
  fone: {
    pt: "Fone JBL",
    en: "JBL Headphones",
    esAR: "Auriculares JBL",
  },
  tenis: {
    pt: "Tênis Adidas",
    en: "Adidas Sneakers",
    esAR: "Zapatillas Adidas",
  },
  mesa: {
    pt: "Mesa Smart",
    en: "Smart Table",
    esAR: "Mesa Inteligente",
  },
  cafeteira: {
    pt: "Cafeteira",
    en: "Coffee Maker",
    esAR: "Cafetera",
  },
};

const CATEGORIES: Record<string, MultilingualText> = {
  electronics: {
    pt: "Eletrônicos",
    en: "Electronics",
    esAR: "Electrónicos",
  },
  clothing: {
    pt: "Vestuário",
    en: "Clothing",
    esAR: "Ropa",
  },
  home: {
    pt: "Casa",
    en: "Home",
    esAR: "Hogar",
  },
};

const CLIENT_NAMES: Record<string, MultilingualText> = {
  ana: {
    pt: "Ana Silva",
    en: "Anna Silva",
    esAR: "Ana Silva",
  },
  carlos: {
    pt: "Carlos Mendes",
    en: "Carlos Mendes",
    esAR: "Carlos Méndez",
  },
  julia: {
    pt: "Julia Costa",
    en: "Julia Costa",
    esAR: "Julia Costa",
  },
  pedro: {
    pt: "Pedro Alves",
    en: "Pedro Alves",
    esAR: "Pedro Alves",
  },
  mariana: {
    pt: "Mariana Rocha",
    en: "Mariana Rocha",
    esAR: "Mariana Rocha",
  },
  rafael: {
    pt: "Rafael Lima",
    en: "Rafael Lima",
    esAR: "Rafael Lima",
  },
  fernanda: {
    pt: "Fernanda Gomes",
    en: "Fernanda Gomes",
    esAR: "Fernanda Gómez",
  },
  bruno: {
    pt: "Bruno Souza",
    en: "Bruno Souza",
    esAR: "Bruno Souza",
  },
};

const PRODUCT_DEFS: Array<{
  id: string;
  nameKey: string;
  categoryKey: string;
  price: number;
}> = [
  { id: "iphone", nameKey: "iphone", categoryKey: "electronics", price: 4299 },
  { id: "nike", nameKey: "nike", categoryKey: "clothing", price: 699 },
  {
    id: "notebook",
    nameKey: "notebook",
    categoryKey: "electronics",
    price: 3199,
  },
  { id: "polo", nameKey: "polo", categoryKey: "clothing", price: 129 },
  { id: "fone", nameKey: "fone", categoryKey: "electronics", price: 399 },
  { id: "tenis", nameKey: "tenis", categoryKey: "clothing", price: 459 },
  { id: "mesa", nameKey: "mesa", categoryKey: "home", price: 899 },
  { id: "cafeteira", nameKey: "cafeteira", categoryKey: "home", price: 319 },
];

const CLIENT_DEFS = [
  {
    id: "ana",
    nameKey: "ana",
    email: "ana.silva@mail.com",
    phone: "+55 11 91234-5678",
  },
  {
    id: "carlos",
    nameKey: "carlos",
    email: "carlos.mendes@mail.com",
    phone: "+55 11 92345-6789",
  },
  {
    id: "julia",
    nameKey: "julia",
    email: "julia.costa@mail.com",
    phone: "+55 11 93456-7890",
  },
  {
    id: "pedro",
    nameKey: "pedro",
    email: "pedro.alves@mail.com",
    phone: "+55 11 94567-8901",
  },
  {
    id: "mariana",
    nameKey: "mariana",
    email: "mariana.rocha@mail.com",
    phone: "+55 11 95678-9012",
  },
  {
    id: "rafael",
    nameKey: "rafael",
    email: "rafael.lima@mail.com",
    phone: "+55 11 96789-0123",
  },
  {
    id: "fernanda",
    nameKey: "fernanda",
    email: "fernanda.gomes@mail.com",
    phone: "+55 11 97890-1234",
  },
  {
    id: "bruno",
    nameKey: "bruno",
    email: "bruno.souza@mail.com",
    phone: "+55 11 98901-2345",
  },
];

export function buildSeedData(language: Language = "en"): DB {
  const clients: Client[] = CLIENT_DEFS.map((clientDef, i) => ({
    id: uid(),
    name: CLIENT_NAMES[clientDef.nameKey][
      language === "es-AR" ? "esAR" : language
    ],
    email: clientDef.email,
    phone: clientDef.phone,
    totalPurchases: 0,
    color: COLORS[i % COLORS.length],
  }));

  const products: Product[] = PRODUCT_DEFS.map((productDef, i) => ({
    id: uid(),
    name: PRODUCT_NAMES[productDef.nameKey][
      language === "es-AR" ? "esAR" : language
    ],
    category:
      CATEGORIES[productDef.categoryKey][
        language === "es-AR" ? "esAR" : language
      ],
    price: productDef.price,
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
