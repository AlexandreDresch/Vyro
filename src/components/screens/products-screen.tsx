import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { fmt } from "../../utils/helpers";
import { StockBar } from "../common/stock-bar";

interface ProductsScreenProps {
  onDetail: (id: string) => void;
}

export function ProductsScreen({ onDetail }: ProductsScreenProps) {
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => {
    if (!db) return [];
    const cats = new Set(db.products.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [db]);

  const filteredProducts = useMemo(() => {
    if (!db) return [];

    let filtered = db.products.filter(
      (p) =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    return filtered;
  }, [db, searchQuery, categoryFilter]);

  const getStockBadge = (stock: number) => {
    if (stock === 0)
      return { bg: "#3a1a1a", text: "#f87171", label: "Out of Stock" };
    if (stock < 10)
      return { bg: "#3a1a1a", text: "#f87171", label: "Critical" };
    if (stock < 30)
      return { bg: "#3a2e1a", text: "#fbbf24", label: "Low Stock" };
    return { bg: "#1a3a2a", text: "#6ee7b7", label: "In Stock" };
  };

  if (!db) return null;

  const totalStock = db.products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = db.products.filter((p) => p.stock < 10).length;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.subtitle}>{db.products.length} items</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Products</Text>
          <Text style={styles.statValue}>{db.products.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Stock</Text>
          <Text style={styles.statValue}>{totalStock}</Text>
        </View>
        <View
          style={[styles.statCard, lowStockCount > 0 && styles.statCardWarning]}
        >
          <Text style={styles.statLabel}>Low Stock</Text>
          <Text
            style={[
              styles.statValue,
              lowStockCount > 0 && styles.statValueWarning,
            ]}
          >
            {lowStockCount}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name or category..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              categoryFilter === cat && styles.filterChipActive,
            ]}
            onPress={() => setCategoryFilter(cat)}
          >
            <Text
              style={[
                styles.filterText,
                categoryFilter === cat && styles.filterTextActive,
              ]}
            >
              {cat === "all" ? "All" : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listCard}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredProducts.map((p) => {
            const badge = getStockBadge(p.stock);
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => onDetail(p.id)}
                style={styles.productRow}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.productIcon,
                    { backgroundColor: p.color + "22" },
                  ]}
                >
                  <Text style={[styles.productIconText, { color: p.color }]}>
                    📦
                  </Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.productCategory}>{p.category}</Text>
                  <StockBar stock={p.stock} />
                </View>
                <View style={styles.productStats}>
                  <Text style={styles.productPrice}>{fmt(p.price)}</Text>
                  <View
                    style={[styles.stockBadge, { backgroundColor: badge.bg }]}
                  >
                    <Text style={[styles.stockText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                  <Text style={styles.stockCount}>{p.stock} units</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statCardWarning: {
    backgroundColor: "rgba(248,113,113,0.05)",
    borderColor: "rgba(248,113,113,0.2)",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 6,
    textAlign: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  statValueWarning: {
    color: "#f87171",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: "#666",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#e5e5e5",
    padding: 0,
  },
  clearIcon: {
    fontSize: 16,
    color: "#666",
    padding: 4,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  filterChipActive: {
    backgroundColor: "#e8b84b",
    borderColor: "#e8b84b",
  },
  filterText: {
    fontSize: 13,
    color: "#999",
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  listCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  productIconText: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  productStats: {
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e8b84b",
    marginBottom: 6,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  stockText: {
    fontSize: 10,
    fontWeight: "600",
  },
  stockCount: {
    fontSize: 10,
    color: "#666",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
});
