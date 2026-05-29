import {
  FileSpreadsheet,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../hooks/use-translation";
import { Tab } from "../../types";

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useTranslation();

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: t.dashboard,
      icon: (
        <LayoutDashboard
          size={20}
          color={activeTab === "dashboard" ? "#e8b84b" : "#666"}
        />
      ),
    },
    {
      id: "sales",
      label: t.sales,
      icon: (
        <FileSpreadsheet
          size={20}
          color={activeTab === "sales" ? "#e8b84b" : "#666"}
        />
      ),
    },
    {
      id: "products",
      label: t.products,
      icon: (
        <Package
          size={20}
          color={activeTab === "products" ? "#e8b84b" : "#666"}
        />
      ),
    },
    {
      id: "clients",
      label: t.clients,
      icon: (
        <Users size={20} color={activeTab === "clients" ? "#e8b84b" : "#666"} />
      ),
    },
  ];

  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === tab.id && styles.tabIconActive,
            ]}
          >
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.tabLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabIcon: {
    fontSize: 20,
    color: "#666",
  },
  tabIconActive: {
    color: "#e8b84b",
  },
  tabLabel: {
    fontSize: 10,
    color: "#666",
  },
  tabLabelActive: {
    color: "#e8b84b",
  },
});
