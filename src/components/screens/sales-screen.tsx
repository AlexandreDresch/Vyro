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
import { fmt, initials, statusColor } from "../../utils/helpers";
import { ListItem } from "../common/list-item";

interface SalesScreenProps {
  onDetail: (id: string) => void;
}

export function SalesScreen({ onDetail }: SalesScreenProps) {
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSales = useMemo(() => {
    if (!db) return [];

    let filtered = db.sales.filter(
      (s) =>
        !searchQuery ||
        s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.client.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [db, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    if (!db) return { total: 0, paid: 0, pending: 0, cancelled: 0 };
    return {
      total: db.sales.length,
      paid: db.sales.filter((s) => s.status === "paid").length,
      pending: db.sales.filter((s) => s.status === "pending").length,
      cancelled: db.sales.filter((s) => s.status === "cancelled").length,
    };
  }, [db]);

  if (!db) return null;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sales</Text>
          <Text style={styles.subtitle}>{stats.total} transactions</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={[styles.statCard, styles.statCardPaid]}>
          <Text style={styles.statLabel}>Paid</Text>
          <Text style={[styles.statValue, styles.statValuePaid]}>
            {stats.paid}
          </Text>
        </View>
        <View style={[styles.statCard, styles.statCardPending]}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, styles.statValuePending]}>
            {stats.pending}
          </Text>
        </View>
        <View style={[styles.statCard, styles.statCardCancelled]}>
          <Text style={styles.statLabel}>Cancelled</Text>
          <Text style={[styles.statValue, styles.statValueCancelled]}>
            {stats.cancelled}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sales by product or client..."
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
        <TouchableOpacity
          style={[
            styles.filterChip,
            statusFilter === "all" && styles.filterChipActive,
          ]}
          onPress={() => setStatusFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              statusFilter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            statusFilter === "paid" && styles.filterChipActivePaid,
          ]}
          onPress={() => setStatusFilter("paid")}
        >
          <Text
            style={[
              styles.filterText,
              statusFilter === "paid" && styles.filterTextActive,
            ]}
          >
            Paid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            statusFilter === "pending" && styles.filterChipActivePending,
          ]}
          onPress={() => setStatusFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              statusFilter === "pending" && styles.filterTextActive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            statusFilter === "cancelled" && styles.filterChipActiveCancelled,
          ]}
          onPress={() => setStatusFilter("cancelled")}
        >
          <Text
            style={[
              styles.filterText,
              statusFilter === "cancelled" && styles.filterTextActive,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.listCard}>
        {filteredSales.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyStateText}>No sales found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredSales.map((s) => {
            const cl = db.clients.find((c) => c.id === s.clientId);
            return (
              <ListItem
                key={s.id}
                color={cl?.color ?? "#888"}
                avatarContent={initials(s.client)}
                name={s.product}
                sub={`${s.client} · ${s.date}`}
                onClick={() => onDetail(s.id)}
                rightTop={<Text style={styles.amountText}>{fmt(s.total)}</Text>}
                rightBottom={
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor[s.status].bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColor[s.status].text },
                      ]}
                    >
                      {s.status}
                    </Text>
                  </View>
                }
              />
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
  statCardPaid: {
    backgroundColor: "rgba(110,231,183,0.05)",
    borderColor: "rgba(110,231,183,0.2)",
  },
  statCardPending: {
    backgroundColor: "rgba(251,191,36,0.05)",
    borderColor: "rgba(251,191,36,0.2)",
  },
  statCardCancelled: {
    backgroundColor: "rgba(248,113,113,0.05)",
    borderColor: "rgba(248,113,113,0.2)",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  statValuePaid: {
    color: "#6ee7b7",
  },
  statValuePending: {
    color: "#fbbf24",
  },
  statValueCancelled: {
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
  filterChipActivePaid: {
    backgroundColor: "#6ee7b7",
    borderColor: "#6ee7b7",
  },
  filterChipActivePending: {
    backgroundColor: "#fbbf24",
    borderColor: "#fbbf24",
  },
  filterChipActiveCancelled: {
    backgroundColor: "#f87171",
    borderColor: "#f87171",
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
  amountText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e8b84b",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
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
