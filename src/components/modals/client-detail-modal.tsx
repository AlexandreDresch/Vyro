import { Pencil } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { Client } from "../../types";
import { fmt } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Modal } from "../common/modal";
import { EditClientModal } from "./edit-client-modal";

interface ClientDetailModalProps {
  client: Client;
  onClose: () => void;
  onDelete?: () => void;
}

export function ClientDetailModal({
  client,
  onClose,
  onDelete,
}: ClientDetailModalProps) {
  const { db, deleteClient, updateClient } = useDB();

  const [isEditing, setIsEditing] = useState(false);

  const stats = useMemo(() => {
    const sales = db?.sales.filter((s) => s.clientId === client.id) || [];
    const paidSales = sales.filter((s) => s.status === "paid");
    const totalSpent = paidSales.reduce((a, s) => a + s.total, 0);
    const averageOrder = sales.length > 0 ? totalSpent / sales.length : 0;

    return {
      totalOrders: sales.length,
      paidOrders: paidSales.length,
      cancelledOrders: sales.filter((s) => s.status === "cancelled").length,
      pendingOrders: sales.filter((s) => s.status === "pending").length,
      totalSpent,
      averageOrder,
    };
  }, [db, client.id]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteClient(client.id);
      onClose();
    }
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${client.email}`);
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${client.phone}`);
  };

  return (
    <Modal title={client.name} onClose={onClose}>
      {!isEditing ? (
        <>
          <View style={styles.contactSection}>
            <TouchableOpacity
              onPress={handleEmail}
              style={styles.contactButton}
            >
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactText}>{client.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePhone}
              style={styles.contactButton}
            >
              <Text style={styles.contactIcon}>📱</Text>
              <Text style={styles.contactText}>{client.phone}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Total Spent</Text>
              <Text style={styles.statBoxValue}>{fmt(stats.totalSpent)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Avg. Order</Text>
              <Text style={styles.statBoxValue}>{fmt(stats.averageOrder)}</Text>
            </View>
          </View>

          <View style={styles.orderStats}>
            <Text style={styles.sectionTitle}>Order Statistics</Text>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>Total Orders</Text>
              <Text style={styles.orderStatValue}>{stats.totalOrders}</Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>Paid</Text>
              <Text style={[styles.orderStatValue, { color: "#6ee7b7" }]}>
                {stats.paidOrders}
              </Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>Pending</Text>
              <Text style={[styles.orderStatValue, { color: "#fbbf24" }]}>
                {stats.pendingOrders}
              </Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>Cancelled</Text>
              <Text style={[styles.orderStatValue, { color: "#f87171" }]}>
                {stats.cancelledOrders}
              </Text>
            </View>
          </View>

          <ButtonRow
            onCancel={handleDelete}
            onConfirm={onClose}
            confirmLabel="Close"
            cancelLabel="Delete Client"
          />

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              Edit Client{"  "}
              <Pencil
                size={14}
                color={"#e8b84b"}
                style={styles.editButtonIcon}
              />
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <EditClientModal
          client={client}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => {
            updateClient(updated);
            setIsEditing(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  contactSection: {
    gap: 12,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  contactIcon: {
    fontSize: 20,
  },
  contactText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e8b84b",
  },
  orderStats: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  orderStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  orderStatLabel: {
    fontSize: 13,
    color: "#999",
  },
  orderStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
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
