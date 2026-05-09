import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KpiCard({
  label,
  value,
  sub,
  accent = false,
  trend,
  trendValue,
}: KpiCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "#6ee7b7";
    if (trend === "down") return "#f87171";
    return "#e8b84b";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent && styles.valueAccent]}>{value}</Text>
      {sub && (
        <View style={styles.subContainer}>
          <Text style={styles.sub}>{sub}</Text>
        </View>
      )}
      {trend && trendValue && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {getTrendIcon()} {trendValue}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  valueAccent: {
    color: "#e8b84b",
  },
  subContainer: {
    marginTop: 4,
  },
  sub: {
    fontSize: 11,
    color: "#6ee7b7",
  },
  trendContainer: {
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
