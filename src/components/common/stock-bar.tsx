import React from "react";
import { StyleSheet, View } from "react-native";

interface StockBarProps {
  stock: number;
  maxStock?: number;
  showPercentage?: boolean;
  height?: number;
  width?: number;
}

export function StockBar({
  stock,
  maxStock = 100,
  showPercentage = false,
  height = 3,
  width = 80,
}: StockBarProps) {
  const percentage = Math.min((stock / maxStock) * 100, 100);

  const getBarColor = () => {
    if (stock < 10) return "#e05252";
    if (stock < 30) return "#e8b84b";
    return "#4caf79";
  };

  const barColor = getBarColor();
  const barWidth = (percentage / 100) * width;

  return (
    <View style={[styles.container, { width, height }]}>
      <View
        style={[
          styles.fill,
          {
            width: barWidth,
            height,
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 2,
  },
  labelContainer: {
    gap: 4,
  },
  labelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelText: {
    fontSize: 11,
    color: "#666",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  barContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
});
