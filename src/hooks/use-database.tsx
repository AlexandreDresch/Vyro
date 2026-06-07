import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { UserPreferences } from "../components/screens/setup-screen";
import { Client, DB, Product, Sale } from "../types";
import { formatCurrencyFull, formatLargeCurrency } from "../utils/helpers";
import { loadDB, persistDB } from "../utils/storage";

interface DBContextType {
  db: DB | null;
  preferences: UserPreferences | null;
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
  checkStockAvailability: (productId: string, quantity: number) => boolean;
  getClientSalesCount: (clientId: string) => number;
  getProductSalesCount: (productId: string) => number;
  smartFormatCurrency: (amount: number) => string;
  formatCurrencyFull: (amount: number) => string;
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
    if (!db || !preferences) return;

    const product = db.products.find((p) => p.id === s.productId);
    if (!product) return;

    const shouldReserveStock =
      s.status === "paid" ||
      (s.status === "pending" && preferences.stockBehavior === "reserve");

    if (shouldReserveStock && product.stock < s.quantity) {
      Alert.alert(
        "Insufficient Stock",
        `Only ${product.stock} units available in stock.`,
        [{ text: "OK" }],
      );
      return;
    }

    let updatedProducts = [...db.products];
    if (shouldReserveStock) {
      updatedProducts = updatedProducts.map((p) =>
        p.id === s.productId ? { ...p, stock: p.stock - s.quantity } : p,
      );
    }

    let updatedClients = [...db.clients];
    if (s.status === "paid") {
      updatedClients = updatedClients.map((c) =>
        c.id === s.clientId
          ? { ...c, totalPurchases: c.totalPurchases + s.total }
          : c,
      );
    }

    const next = {
      ...db,
      sales: [...db.sales, s],
      products: updatedProducts,
      clients: updatedClients,
    };

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

    const saleToDelete = db.sales.find((s) => s.id === id);
    if (!saleToDelete) return;

    let updatedProducts = [...db.products];
    if (saleToDelete.status === "paid") {
      updatedProducts = updatedProducts.map((p) =>
        p.id === saleToDelete.productId
          ? { ...p, stock: p.stock + saleToDelete.quantity }
          : p,
      );
    }

    let updatedClients = [...db.clients];
    if (saleToDelete.status === "paid") {
      updatedClients = updatedClients.map((c) =>
        c.id === saleToDelete.clientId
          ? {
              ...c,
              totalPurchases: Math.max(
                0,
                c.totalPurchases - saleToDelete.total,
              ),
            }
          : c,
      );
    }

    const updatedSales = db.sales.filter((s) => s.id !== id);

    await updateDB({
      ...db,
      sales: updatedSales,
      products: updatedProducts,
      clients: updatedClients,
    });
  };

  const deleteProduct = async (id: string) => {
    if (!db) return;

    const productSales = db.sales.filter((s) => s.productId === id);

    if (productSales.length > 0) {
      Alert.alert(
        "Cannot Delete Product",
        `This product has ${productSales.length} sale(s). Please delete the associated sales first.`,
        [{ text: "OK" }],
      );
      return;
    }

    await updateDB({ ...db, products: db.products.filter((p) => p.id !== id) });
  };

  const deleteClient = async (id: string) => {
    if (!db) return;

    const clientSales = db.sales.filter((s) => s.clientId === id);

    if (clientSales.length > 0) {
      Alert.alert(
        "Cannot Delete Client",
        `This client has ${clientSales.length} sale(s). Please delete the associated sales first.`,
        [{ text: "OK" }],
      );
      return;
    }

    await updateDB({ ...db, clients: db.clients.filter((c) => c.id !== id) });
  };

  const updateSale = async (updatedSale: Sale) => {
    if (!db) return;

    const oldSale = db.sales.find((s) => s.id === updatedSale.id);
    if (!oldSale) return;

    const product = db.products.find((p) => p.id === updatedSale.productId);
    if (!product) return;

    let updatedProducts = [...db.products];
    const stockDifference = updatedSale.quantity - oldSale.quantity;

    if (updatedSale.status === "paid" && oldSale.status === "paid") {
      if (stockDifference !== 0) {
        const newStock = product.stock - stockDifference;
        if (newStock < 0) {
          Alert.alert(
            "Insufficient Stock",
            `Not enough stock available. Only ${product.stock} units in stock.`,
            [{ text: "OK" }],
          );
          return;
        }
        updatedProducts = updatedProducts.map((p) =>
          p.id === updatedSale.productId ? { ...p, stock: newStock } : p,
        );
      }
    } else if (updatedSale.status === "paid" && oldSale.status !== "paid") {
      const newStock = product.stock - updatedSale.quantity;
      if (newStock < 0) {
        Alert.alert(
          "Insufficient Stock",
          `Not enough stock available. Only ${product.stock} units in stock.`,
          [{ text: "OK" }],
        );
        return;
      }
      updatedProducts = updatedProducts.map((p) =>
        p.id === updatedSale.productId ? { ...p, stock: newStock } : p,
      );
    } else if (updatedSale.status !== "paid" && oldSale.status === "paid") {
      updatedProducts = updatedProducts.map((p) =>
        p.id === updatedSale.productId
          ? { ...p, stock: product.stock + oldSale.quantity }
          : p,
      );
    }

    let updatedClients = [...db.clients];

    if (oldSale.status === "paid" && updatedSale.status !== "paid") {
      updatedClients = updatedClients.map((c) =>
        c.id === oldSale.clientId
          ? {
              ...c,
              totalPurchases: Math.max(0, c.totalPurchases - oldSale.total),
            }
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
          return {
            ...c,
            totalPurchases: Math.max(0, c.totalPurchases - oldSale.total),
          };
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
          ? { ...c, totalPurchases: Math.max(0, c.totalPurchases + diff) }
          : c,
      );
    }

    const updatedSales = db.sales.map((s) =>
      s.id === updatedSale.id ? updatedSale : s,
    );

    await updateDB({
      ...db,
      sales: updatedSales,
      products: updatedProducts,
      clients: updatedClients,
    });
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

  const checkStockAvailability = (
    productId: string,
    quantity: number,
  ): boolean => {
    if (!db) return false;
    const product = db.products.find((p) => p.id === productId);
    if (!product) return false;
    return product.stock >= quantity;
  };

  const getClientSalesCount = (clientId: string): number => {
    if (!db) return 0;
    return db.sales.filter((s) => s.clientId === clientId).length;
  };

  const getProductSalesCount = (productId: string): number => {
    if (!db) return 0;
    return db.sales.filter((s) => s.productId === productId).length;
  };

  const smartFormatCurrency = (amount: number): string => {
    if (!preferences) return formatLargeCurrency(amount, "BRL");
    return formatLargeCurrency(amount, preferences.currency);
  };

  const formatCurrencyFullFn = (amount: number): string => {
    if (!preferences) return formatCurrencyFull(amount, "BRL");
    return formatCurrencyFull(amount, preferences.currency);
  };

  return (
    <DBContext.Provider
      value={{
        db,
        preferences,
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
        checkStockAvailability,
        getClientSalesCount,
        getProductSalesCount,
        smartFormatCurrency,
        formatCurrencyFull: formatCurrencyFullFn,
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
