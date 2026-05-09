import { Search, Users } from "lucide-react-native";
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
import { fmt, initials } from "../../utils/helpers";
import { ListItem } from "../common/list-item";

interface ClientsScreenProps {
  onDetail: (id: string) => void;
}

export function ClientsScreen({ onDetail }: ClientsScreenProps) {
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "spent">("name");

  const filteredAndSortedClients = useMemo(() => {
    if (!db) return [];

    let filtered = db.clients.filter(
      (c) =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery),
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "spent") {
      filtered.sort((a, b) => b.totalPurchases - a.totalPurchases);
    }

    return filtered;
  }, [db, searchQuery, sortBy]);

  const stats = useMemo(() => {
    if (!db)
      return { total: 0, totalSpent: 0, averageSpent: 0, topClient: null };

    const totalSpent = db.clients.reduce((sum, c) => sum + c.totalPurchases, 0);
    const topClient = [...db.clients].sort(
      (a, b) => b.totalPurchases - a.totalPurchases,
    )[0];

    return {
      total: db.clients.length,
      totalSpent,
      averageSpent: db.clients.length > 0 ? totalSpent / db.clients.length : 0,
      topClient: topClient?.name || null,
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
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.subtitle}>{stats.total} contacts</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Clients</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={[styles.statValue, styles.statValueAccent]}>
            {fmt(stats.totalSpent)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Spent</Text>
          <Text style={styles.statValue}>{fmt(stats.averageSpent)}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients by name, email, or phone..."
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

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "name" && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy("name")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === "name" && styles.sortButtonTextActive,
            ]}
          >
            Name
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "spent" && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy("spent")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === "spent" && styles.sortButtonTextActive,
            ]}
          >
            Total Spent
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listCard}>
        {filteredAndSortedClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color="#fff" style={styles.emptyIcon} />
            <Text style={styles.emptyStateText}>No clients found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search
            </Text>
          </View>
        ) : (
          filteredAndSortedClients.map((c) => {
            const orders = db.sales.filter((s) => s.clientId === c.id).length;
            const paidOrders = db.sales.filter(
              (s) => s.clientId === c.id && s.status === "paid",
            ).length;

            return (
              <ListItem
                key={c.id}
                color={c.color}
                avatarContent={initials(c.name)}
                name={c.name}
                sub={c.email}
                onClick={() => onDetail(c.id)}
                rightTop={
                  <Text style={styles.spentText}>{fmt(c.totalPurchases)}</Text>
                }
                rightBottom={
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderCount}>{orders} orders</Text>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>
                        {paidOrders} paid
                      </Text>
                    </View>
                  </View>
                }
                badge={
                  c.totalPurchases > 10000
                    ? { text: "VIP", color: "#e8b84b" }
                    : undefined
                }
              />
            );
          })
        )}
      </View>

      {/* Top Client Highlight */}
      {stats.topClient && filteredAndSortedClients.length > 0 && (
        <View style={styles.topClientCard}>
          <Text style={styles.topClientIcon}>🏆</Text>
          <View style={styles.topClientInfo}>
            <Text style={styles.topClientLabel}>Top Spender</Text>
            <Text style={styles.topClientName}>{stats.topClient}</Text>
          </View>
        </View>
      )}
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
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 6,
    textAlign: "center",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  statValueAccent: {
    color: "#e8b84b",
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  sortLabel: {
    fontSize: 13,
    color: "#666",
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sortButtonActive: {
    backgroundColor: "#e8b84b",
    borderColor: "#e8b84b",
  },
  sortButtonText: {
    fontSize: 13,
    color: "#999",
  },
  sortButtonTextActive: {
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
  spentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e8b84b",
  },
  orderInfo: {
    alignItems: "center",
    gap: 4,
  },
  orderCount: {
    fontSize: 11,
    color: "#999",
  },
  orderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(110,231,183,0.1)",
  },
  orderBadgeText: {
    fontSize: 9,
    color: "#6ee7b7",
    fontWeight: "600",
  },
  topClientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232,184,75,0.1)",
    borderWidth: 1,
    borderColor: "rgba(232,184,75,0.3)",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    gap: 12,
  },
  topClientIcon: {
    fontSize: 32,
  },
  topClientInfo: {
    flex: 1,
  },
  topClientLabel: {
    fontSize: 11,
    color: "#e8b84b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  topClientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
