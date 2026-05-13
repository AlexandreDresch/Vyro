import React, { createContext, useContext, useEffect, useState } from "react";
import { UserPreferences } from "../components/screens/setup-screen";
import { Client, DB, Product, Sale } from "../types";
import { loadDB, persistDB } from "../utils/storage";

interface DBContextType {
  db: DB | null;
  updateDB: (next: DB) => Promise<void>;
  addSale: (s: Sale) => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  addClient: (c: Client) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
  updateSale: (updatedSale: Sale) => Promise<void>;
  updateProduct: (
    updatedProduct: Product,
    preserveHistory?: boolean,
  ) => Promise<void>;
  updateClient: (updatedClient: Client) => Promise<void>;
}

interface DBProviderProps {
  children: React.ReactNode;
  preferences: UserPreferences | null;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export function DBProvider({ children, preferences }: DBProviderProps) {
  const [db, setDB] = useState<DB | null>(null);

  const formatCurrency = (amount: number): string => {
    if (!preferences) return `R$ ${amount.toFixed(2)}`;

    const currency = preferences.currency;
    const language = preferences.language;

    switch (currency) {
      case "BRL":
        return amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      case "USD":
        return amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      case "ARS":
        return amount.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        });
      default:
        return `R$ ${amount.toFixed(2)}`;
    }
  };

  useEffect(() => {
    loadDB().then(setDB);
  }, []);

  const updateDB = async (next: DB) => {
    setDB(next);
    await persistDB(next);
  };

  const addSale = async (s: Sale) => {
    if (!db) return;
    const next = { ...db, sales: [...db.sales, s] };
    if (s.status === "paid") {
      next.clients = next.clients.map((c) =>
        c.id === s.clientId
          ? { ...c, totalPurchases: c.totalPurchases + s.total }
          : c,
      );
    }
    await updateDB(next);
  };

  const addProduct = async (p: Product) => {
    if (!db) return;
    await updateDB({ ...db, products: [...db.products, p] });
  };

  const addClient = async (c: Client) => {
    if (!db) return;
    await updateDB({ ...db, clients: [...db.clients, c] });
  };

  const updateClient = async (updatedClient: Client) => {
    if (!db) return;

    const updatedSales = db.sales.map((sale) =>
      sale.clientId === updatedClient.id
        ? { ...sale, client: updatedClient.name }
        : sale,
    );

    const updatedClients = db.clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c,
    );

    await updateDB({
      ...db,
      sales: updatedSales,
      clients: updatedClients,
    });
  };

  const deleteSale = async (id: string) => {
    if (!db) return;
    await updateDB({ ...db, sales: db.sales.filter((s) => s.id !== id) });
  };

  const updateSale = async (updatedSale: Sale) => {
    if (!db) return;

    const oldSale = db.sales.find((s) => s.id === updatedSale.id);
    if (!oldSale) return;

    let updatedClients = [...db.clients];

    if (oldSale.status === "paid" && updatedSale.status !== "paid") {
      updatedClients = updatedClients.map((c) =>
        c.id === oldSale.clientId
          ? { ...c, totalPurchases: c.totalPurchases - oldSale.total }
          : c,
      );
    } else if (oldSale.status !== "paid" && updatedSale.status === "paid") {
      updatedClients = updatedClients.map((c) =>
        c.id === updatedSale.clientId
          ? { ...c, totalPurchases: c.totalPurchases + updatedSale.total }
          : c,
      );
    } else if (
      oldSale.clientId !== updatedSale.clientId &&
      oldSale.status === "paid"
    ) {
      updatedClients = updatedClients.map((c) => {
        if (c.id === oldSale.clientId) {
          return { ...c, totalPurchases: c.totalPurchases - oldSale.total };
        }
        if (c.id === updatedSale.clientId && updatedSale.status === "paid") {
          return { ...c, totalPurchases: c.totalPurchases + updatedSale.total };
        }
        return c;
      });
    } else if (
      oldSale.total !== updatedSale.total &&
      updatedSale.status === "paid"
    ) {
      const diff = updatedSale.total - oldSale.total;
      updatedClients = updatedClients.map((c) =>
        c.id === updatedSale.clientId
          ? { ...c, totalPurchases: c.totalPurchases + diff }
          : c,
      );
    }

    const updatedSales = db.sales.map((s) =>
      s.id === updatedSale.id ? updatedSale : s,
    );

    await updateDB({
      ...db,
      sales: updatedSales,
      clients: updatedClients,
    });
  };

  const deleteProduct = async (id: string) => {
    if (!db) return;
    await updateDB({ ...db, products: db.products.filter((p) => p.id !== id) });
  };

  const updateProduct = async (
    updatedProduct: Product,
    preserveHistory: boolean = true,
  ) => {
    if (!db) return;

    if (preserveHistory) {
      const updatedProducts = db.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      );

      await updateDB({
        ...db,
        products: updatedProducts,
      });
    } else {
      const updatedSales = db.sales.map((sale) => {
        if (sale.productId === updatedProduct.id) {
          return {
            ...sale,
            product: updatedProduct.name,
            price: updatedProduct.price,
            total: sale.quantity * updatedProduct.price,
          };
        }
        return sale;
      });

      const updatedClients = db.clients.map((client) => {
        const clientSales = updatedSales.filter(
          (s) => s.clientId === client.id && s.status === "paid",
        );
        const totalPurchases = clientSales.reduce((sum, s) => sum + s.total, 0);
        return { ...client, totalPurchases };
      });

      const updatedProducts = db.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      );

      await updateDB({
        ...db,
        products: updatedProducts,
        sales: updatedSales,
        clients: updatedClients,
      });
    }
  };

  const deleteClient = async (id: string) => {
    if (!db) return;
    await updateDB({ ...db, clients: db.clients.filter((c) => c.id !== id) });
  };

  return (
    <DBContext.Provider
      value={{
        db,
        updateDB,
        addSale,
        addProduct,
        addClient,
        deleteSale,
        deleteProduct,
        deleteClient,
        formatCurrency,
        updateProduct,
        updateSale,
        updateClient,
      }}
    >
      {children}
    </DBContext.Provider>
  );
}

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) throw new Error("useDB must be used within DBProvider");
  return context;
};
