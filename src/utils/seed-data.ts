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

const getDateMonthsAgo = (monthsAgo: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateSalesData = (products: Product[], clients: Client[]): Sale[] => {
  const sales: Sale[] = [];
  const months = [5, 4, 3, 2, 1, 0];

  const salesPerMonth = [12, 15, 18, 22, 25, 30];

  months.forEach((monthsAgo, index) => {
    const saleDate = getDateMonthsAgo(monthsAgo);
    const monthStr = formatDate(saleDate);
    const numSales = salesPerMonth[index];

    for (let i = 0; i < numSales; i++) {
      let productIndex;
      if (monthsAgo <= 2) {
        const trendingProducts = [0, 1, 2, 4];
        productIndex =
          trendingProducts[Math.floor(Math.random() * trendingProducts.length)];
      } else {
        productIndex = Math.floor(Math.random() * products.length);
      }

      const prod = products[productIndex];
      const client = clients[Math.floor(Math.random() * clients.length)];

      let qty: number;
      if (monthsAgo <= 1) {
        qty = Math.floor(2 + Math.random() * 4);
      } else if (monthsAgo <= 3) {
        qty = Math.floor(1 + Math.random() * 3);
      } else {
        qty = Math.floor(1 + Math.random() * 2);
      }

      const total = qty * prod.price;

      let status: Status;
      const random = Math.random();
      if (monthsAgo <= 1) {
        if (random < 0.85) status = "paid";
        else if (random < 0.95) status = "pending";
        else status = "cancelled";
      } else if (monthsAgo <= 3) {
        if (random < 0.75) status = "paid";
        else if (random < 0.9) status = "pending";
        else status = "cancelled";
      } else {
        if (random < 0.65) status = "paid";
        else if (random < 0.85) status = "pending";
        else status = "cancelled";
      }

      sales.push({
        id: uid(),
        date: monthStr,
        product: prod.name,
        productId: prod.id,
        client: client.name,
        clientId: client.id,
        quantity: qty,
        price: prod.price,
        total,
        status,
      });
    }
  });

  for (let i = sales.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sales[i], sales[j]] = [sales[j], sales[i]];
  }

  return sales;
};

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
    stock: Math.floor(15 + Math.random() * 85),
    color: COLORS[i % COLORS.length],
  }));

  const sales = generateSalesData(products, clients);

  sales.forEach((sale) => {
    if (sale.status === "paid") {
      const client = clients.find((c) => c.id === sale.clientId);
      if (client) {
        client.totalPurchases += sale.total;
      }
    }
  });

  return { sales, products, clients };
}
