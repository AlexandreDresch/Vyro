import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useDB } from "../../hooks/use-database";
import { Tab } from "../../types";
import { TabBar } from "./tab-bar";

import { ClientsScreen } from "../screens/clients-screen";
import { DashboardScreen } from "../screens/dashboard-screen";
import { ProductsScreen } from "../screens/products-screen";
import { SalesScreen } from "../screens/sales-screen";

import { AddClientModal } from "../modals/add-client-modal";
import { AddProductModal } from "../modals/add-product-modal";
import { AddSaleModal } from "../modals/add-sale-modal";
import { ClientDetailModal } from "../modals/client-detail-modal";
import { IOModal } from "../modals/IO-modal";
import { ProductDetailModal } from "../modals/product-detail-modal";
import { SaleDetailModal } from "../modals/sale-detail-modal";

export default function AppNavigator() {
  const { db } = useDB();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [detailSaleId, setDetailSaleId] = useState<string | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [detailClientId, setDetailClientId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState<Tab | null>(null);
  const [showIO, setShowIO] = useState(false);

  if (!db) {
    return null;
  }

  const detailSale = detailSaleId
    ? db.sales.find((s) => s.id === detailSaleId)
    : null;
  const detailProduct = detailProductId
    ? db.products.find((p) => p.id === detailProductId)
    : null;
  const detailClient = detailClientId
    ? db.clients.find((c) => c.id === detailClientId)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === "dashboard" && (
          <DashboardScreen onOpenIO={() => setShowIO(true)} />
        )}
        {activeTab === "sales" && <SalesScreen onDetail={setDetailSaleId} />}
        {activeTab === "products" && (
          <ProductsScreen onDetail={setDetailProductId} />
        )}
        {activeTab === "clients" && (
          <ClientsScreen onDetail={setDetailClientId} />
        )}
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <TouchableOpacity
        onPress={() => setAddMode(activeTab)}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>
          <Plus size={24} />
        </Text>
      </TouchableOpacity>

      {detailSale && (
        <SaleDetailModal
          sale={detailSale}
          onClose={() => setDetailSaleId(null)}
        />
      )}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProductId(null)}
        />
      )}
      {detailClient && (
        <ClientDetailModal
          client={detailClient}
          onClose={() => setDetailClientId(null)}
        />
      )}

      {(addMode === "dashboard" || addMode === "sales") && (
        <AddSaleModal onClose={() => setAddMode(null)} />
      )}
      {addMode === "products" && (
        <AddProductModal onClose={() => setAddMode(null)} />
      )}
      {addMode === "clients" && (
        <AddClientModal onClose={() => setAddMode(null)} />
      )}

      {showIO && <IOModal onClose={() => setShowIO(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8b84b",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#000",
  },
});
