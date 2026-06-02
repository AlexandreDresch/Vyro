import { Pencil } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { Client } from "../../types";
import { formatCurrency } from "../../utils/helpers";
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
  const { db, deleteClient, updateClient, preferences, getClientSalesCount } =
    useDB();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const currency = preferences?.currency || "BRL";
  const salesCount = getClientSalesCount(client.id);

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
    if (salesCount > 0) {
      Alert.alert(
        t.cannotDeleteClient || "Cannot Delete Client",
        t.cannotDeleteClientMessage?.replace("{count}", String(salesCount)) ||
          `This client has ${salesCount} sale(s). Please delete the associated sales first.`,
        [{ text: "OK" }],
      );
      return;
    }

    Alert.alert(
      t.deleteConfirmation || "Confirm Delete",
      t.deleteClientWarning ||
        "Are you sure you want to delete this client? This action cannot be undone.",
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.delete,
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete();
            } else {
              deleteClient(client.id);
              onClose();
            }
          },
        },
      ],
    );
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
              <Text style={styles.contactText}>
                {client.email || t.noEmail}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePhone}
              style={styles.contactButton}
            >
              <Text style={styles.contactIcon}>📱</Text>
              <Text style={styles.contactText}>
                {client.phone || t.noPhone}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{t.totalSpent}</Text>
              <Text style={styles.statBoxValue}>
                {formatCurrency(stats.totalSpent, currency)}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{t.averageOrder}</Text>
              <Text style={styles.statBoxValue}>
                {formatCurrency(stats.averageOrder, currency)}
              </Text>
            </View>
          </View>

          <View style={styles.orderStats}>
            <Text style={styles.sectionTitle}>{t.orderStatistics}</Text>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>{t.totalOrders}</Text>
              <Text style={styles.orderStatValue}>{stats.totalOrders}</Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>{t.paid}</Text>
              <Text style={[styles.orderStatValue, { color: "#6ee7b7" }]}>
                {stats.paidOrders}
              </Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>{t.pending}</Text>
              <Text style={[styles.orderStatValue, { color: "#fbbf24" }]}>
                {stats.pendingOrders}
              </Text>
            </View>

            <View style={styles.orderStatRow}>
              <Text style={styles.orderStatLabel}>{t.cancelled}</Text>
              <Text style={[styles.orderStatValue, { color: "#f87171" }]}>
                {stats.cancelledOrders}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {t.editClient}
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
            cancelLabel={t.deleteClient}
          />
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
