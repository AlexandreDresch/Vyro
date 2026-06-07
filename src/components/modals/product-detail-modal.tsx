import { formatLargeCurrency } from "@/src/utils/helpers";
import { Pencil } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { Product } from "../../types";
import { ButtonRow } from "../common/button-row";
import { Modal } from "../common/modal";
import { StockBar } from "../common/stock-bar";
import { EditProductModal } from "./edit-product-modal";

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
  const {
    db,
    deleteProduct,
    updateProduct,
    preferences,
    getProductSalesCount,
  } = useDB();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const currency = preferences?.currency || "BRL";
  const salesCount = getProductSalesCount(product.id);

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
    if (salesCount > 0) {
      Alert.alert(
        t.cannotDeleteProduct || "Cannot Delete Product",
        t.cannotDeleteProductMessage?.replace("{count}", String(salesCount)) ||
          `This product has ${salesCount} sale(s). Please delete the associated sales first.`,
        [{ text: "OK" }],
      );
      return;
    }

    Alert.alert(
      t.deleteConfirmation || "Confirm Delete",
      t.deleteProductWarning ||
        "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.delete,
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete();
            } else {
              deleteProduct(product.id);
              onClose();
            }
          },
        },
      ],
    );
  };

  const getStockLevel = () => {
    if (product.stock === 0) return t.outOfStock;
    if (product.stock < 10) return t.criticalStock;
    if (product.stock < 30) return t.lowStockStatus;
    return t.goodStock;
  };

  const getStockColor = () => {
    if (product.stock < 10) return "#e05252";
    if (product.stock < 30) return "#e8b84b";
    return "#4caf79";
  };

  const getTranslatedCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      Electronics: t.categoryElectronics,
      Clothing: t.categoryClothing,
      Food: t.categoryFood,
      Home: t.categoryHome,
      Beauty: t.categoryBeauty,
      Sports: t.categorySports,
      Toys: t.categoryToys,
      Books: t.categoryBooks,
      Health: t.categoryHealth,
      Automotive: t.categoryAutomotive,
      Others: t.categoryOthers,
    };
    return categoryMap[category] || category;
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      {!isEditing ? (
        <>
          <View style={styles.headerSection}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: product.color },
              ]}
            />
            <Text style={styles.category}>
              {getTranslatedCategory(product.category)}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{t.price}</Text>
              <Text style={styles.statValue}>
                {formatLargeCurrency(product.price, currency)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{t.stock}</Text>
              <Text style={[styles.statValue, { color: getStockColor() }]}>
                {product.stock} {t.units}
              </Text>
            </View>
          </View>

          <View style={styles.stockSection}>
            <Text style={styles.stockStatus}>{getStockLevel()}</Text>
            <StockBar stock={product.stock} width={100} height={6} />
          </View>

          <View style={styles.divider} />

          <View style={styles.revenueSection}>
            <Text style={styles.sectionTitle}>{t.salesPerformance}</Text>
            <View style={styles.revenueStats}>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>{t.totalRevenue}</Text>
                <Text style={styles.revenueValue}>
                  {formatLargeCurrency(stats.revenue, currency)}
                </Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>{t.paidOrders}</Text>
                <Text style={styles.revenueValue}>{stats.paidOrders}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueLabel}>{t.totalOrders}</Text>
                <Text style={styles.revenueValue}>{stats.totalOrders}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {t.editProduct}
              {"  "}
              <Pencil
                size={14}
                color={"#e8b84b"}
                style={styles.editButtonIcon}
              />
            </Text>
          </TouchableOpacity>

          <ButtonRow
            onCancel={handleDelete}
            onConfirm={onClose}
            confirmLabel={t.close}
            cancelLabel={t.deleteProduct}
          />
        </>
      ) : (
        <EditProductModal
          product={product}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => {
            updateProduct(updated);
            setIsEditing(false);
            onClose();
          }}
        />
      )}
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  editButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e8b84b",
  },
  editButtonIcon: {
    marginRight: 8,
  },
});
