import { ArrowDownUp } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MONTHS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { fmt, initials, statusColor } from "../../utils/helpers";
import { KpiCard } from "../common/kpi-card";
import { ListItem } from "../common/list-item";

interface DashboardScreenProps {
  onOpenIO: () => void;
}

export function DashboardScreen({ onOpenIO }: DashboardScreenProps) {
  const { db } = useDB();

  if (!db) return null;

  const paid = db.sales.filter((s) => s.status === "paid");
  const revenue = paid.reduce((a, s) => a + s.total, 0);
  const pending = db.sales.filter((s) => s.status === "pending").length;

  const barData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const m = String(i + 1).padStart(2, "0");
      return {
        label: MONTHS[i],
        val: paid
          .filter((s) => s.date.includes(`-${m}-`))
          .reduce((a, s) => a + s.total, 0),
      };
    });
  }, [paid]);

  const maxBar = Math.max(...barData.map((b) => b.val), 1);

  const topProds = useMemo(() => {
    const map: Record<
      string,
      { name: string; rev: number; qty: number; color: string }
    > = {};
    paid.forEach((s) => {
      if (!map[s.product]) {
        const pr = db.products.find((p) => p.id === s.productId);
        map[s.product] = {
          name: s.product,
          rev: 0,
          qty: 0,
          color: pr?.color ?? "#888",
        };
      }
      map[s.product].rev += s.total;
      map[s.product].qty += s.quantity;
    });
    return Object.values(map)
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 4);
  }, [paid, db.products]);

  const maxProdRev = Math.max(...topProds.map((p) => p.rev), 1);
  const recent = [...db.sales]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            {new Date().getFullYear()} overview
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenIO} style={styles.iconButton}>
          <ArrowDownUp size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Overview</Text>
        <View style={styles.kpiGrid}>
          <KpiCard
            label="Total Revenue"
            value={fmt(revenue)}
            sub="↑ 12.4% vs last period"
            accent
          />
          <KpiCard
            label="Total Orders"
            value={String(db.sales.length)}
            sub="↑ 5 this month"
          />
          <KpiCard
            label="Paid"
            value={String(paid.length)}
            sub={`${Math.round((paid.length / Math.max(db.sales.length, 1)) * 100)}% of orders`}
          />
          <KpiCard
            label="Pending"
            value={String(pending)}
            sub={pending > 0 ? `${pending} awaiting` : "All clear"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Revenue · Jan–Jun</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {barData.map((b) => (
              <View key={b.label} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(4, Math.round((b.val / maxBar) * 80)) },
                  ]}
                />
                <Text style={styles.barLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Recent Sales</Text>
        <View style={styles.listCard}>
          {recent.map((s) => {
            const cl = db.clients.find((c) => c.id === s.clientId);
            return (
              <ListItem
                key={s.id}
                color={cl?.color ?? "#888"}
                avatarContent={initials(s.client)}
                name={s.product}
                sub={`${s.client} · ${s.date}`}
                rightTop={<Text style={styles.amberText}>{fmt(s.total)}</Text>}
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
          })}
        </View>
      </View>

      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionLabel}>Top Products</Text>
        <View style={styles.listCard}>
          {topProds.map((p) => (
            <View key={p.name} style={styles.productItem}>
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
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.round((p.rev / maxProdRev) * 100)}%` },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.productStats}>
                <Text style={styles.productRevenue}>{fmt(p.rev)}</Text>
                <Text style={styles.productUnits}>{p.qty} units</Text>
              </View>
            </View>
          ))}
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 18,
    color: "#999",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chartCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 100,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: "100%",
    backgroundColor: "rgba(232,184,75,0.8)",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  listCard: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    overflow: "hidden",
  },
  amberText: {
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
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  productIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productIconText: {
    fontSize: 20,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#e8b84b",
    borderRadius: 2,
  },
  productStats: {
    alignItems: "flex-end",
  },
  productRevenue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e8b84b",
    marginBottom: 4,
  },
  productUnits: {
    fontSize: 11,
    color: "#666",
  },
});
