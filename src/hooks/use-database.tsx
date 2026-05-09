import React, { createContext, useContext, useEffect, useState } from "react";
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
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<DB | null>(null);

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

  const deleteSale = async (id: string) => {
    if (!db) return;
    await updateDB({ ...db, sales: db.sales.filter((s) => s.id !== id) });
  };

  const deleteProduct = async (id: string) => {
    if (!db) return;
    await updateDB({ ...db, products: db.products.filter((p) => p.id !== id) });
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
