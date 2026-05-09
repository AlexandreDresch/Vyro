import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDB } from "../../hooks/use-database";
import { Product } from "../../types";
import { fmt } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Modal } from "../common/modal";
import { StockBar } from "../common/stock-bar";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onDelete?: () => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onDelete,
}: ProductDetailModalProps) {
  const { db, deleteProduct } = useDB();

  const stats = useMemo(() => {
    const paid =
      db?.sales.filter(
        (s) => s.productId === product.id && s.status === "paid",
      ) || [];
    const revenue = paid.reduce((a, s) => a + s.total, 0);
    const totalOrders =
      db?.sales.filter((s) => s.productId === product.id).length || 0;
    return { revenue, totalOrders, paidOrders: paid.length };
  }, [db, product.id]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteProduct(product.id);
      onClose();
    }
  };

  const getStockLevel = () => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock < 10) return "Critical Stock";
    if (product.stock < 30) return "Low Stock";
    return "Good Stock";
  };

  const getStockColor = () => {
    if (product.stock < 10) return "#e05252";
    if (product.stock < 30) return "#e8b84b";
    return "#4caf79";
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      <View style={styles.headerSection}>
        <View
          style={[styles.colorIndicator, { backgroundColor: product.color }]}
        />
        <Text style={styles.category}>{product.category}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Price</Text>
          <Text style={styles.statValue}>{fmt(product.price)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Stock</Text>
          <Text style={[styles.statValue, { color: getStockColor() }]}>
            {product.stock} units
          </Text>
        </View>
      </View>

      <View style={styles.stockSection}>
        <Text style={styles.stockStatus}>{getStockLevel()}</Text>
        <StockBar stock={product.stock} width={100} height={6} />
      </View>

      <View style={styles.divider} />

      <View style={styles.revenueSection}>
        <Text style={styles.sectionTitle}>Sales Performance</Text>
        <View style={styles.revenueStats}>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueValue}>{fmt(stats.revenue)}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Paid Orders</Text>
            <Text style={styles.revenueValue}>{stats.paidOrders}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Total Orders</Text>
            <Text style={styles.revenueValue}>{stats.totalOrders}</Text>
          </View>
        </View>
      </View>

      <ButtonRow
        onCancel={handleDelete}
        onConfirm={onClose}
        confirmLabel="Close"
        cancelLabel="Delete Product"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  category: {
    fontSize: 14,
    color: "#999",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  stockSection: {
    marginBottom: 20,
    gap: 8,
  },
  stockStatus: {
    fontSize: 12,
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 16,
  },
  revenueSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  revenueStats: {
    gap: 12,
  },
  revenueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueLabel: {
    fontSize: 13,
    color: "#666",
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e8b84b",
  },
});
