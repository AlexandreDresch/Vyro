import { Pencil } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { Sale, Status } from "../../types";
import {
  formatDate,
  formatLargeCurrency,
  statusColor,
} from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Modal } from "../common/modal";
import { EditSaleModal } from "./edit-sale-modal";

interface SaleDetailModalProps {
  sale: Sale;
  onClose: () => void;
  onDelete?: () => void;
}

export function SaleDetailModal({
  sale,
  onClose,
  onDelete,
}: SaleDetailModalProps) {
  const { deleteSale, updateSale, preferences } = useDB();
  const { t, language } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const currency = preferences?.currency || "BRL";

  const handleDelete = () => {
    Alert.alert(
      t.deleteConfirmation || "Confirm Delete",
      t.deleteSaleWarning ||
        "Are you sure you want to delete this sale? This action cannot be undone.",
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.delete,
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete();
            } else {
              deleteSale(sale.id);
              onClose();
            }
          },
        },
      ],
    );
  };

  const getStatusText = (statusKey: string) => {
    switch (statusKey) {
      case "paid":
        return t.paidSingular;
      case "pending":
        return t.pendingSingular;
      case "cancelled":
        return t.cancelledSingular;
      default:
        return statusKey;
    }
  };

  const detailRows = [
    { label: t.product, value: sale.product, highlight: false },
    { label: t.client, value: sale.client, highlight: false },
    { label: t.date, value: formatDate(sale.date, language), highlight: false },
    { label: t.quantity, value: String(sale.quantity), highlight: false },
    {
      label: t.unitPrice,
      value: formatLargeCurrency(sale.price, currency),
      highlight: false,
    },
    {
      label: t.total,
      value: formatLargeCurrency(sale.total, currency),
      highlight: true,
    },
    { label: t.status, value: getStatusText(sale.status), isStatus: true },
  ];

  return (
    <Modal title={t.saleDetails} onClose={onClose}>
      {!isEditing ? (
        <>
          {detailRows.map((row, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              {row.isStatus ? (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor[sale.status as Status].bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColor[sale.status as Status].text },
                    ]}
                  >
                    {row.value}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.detailValue,
                    row.highlight && styles.highlightValue,
                  ]}
                >
                  {row.value}
                </Text>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {t.editSale}
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
            cancelLabel={t.deleteSale}
          />
        </>
      ) : (
        <EditSaleModal
          sale={sale}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => {
            updateSale(updated);
            setIsEditing(false);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e5e5",
  },
  highlightValue: {
    color: "#e8b84b",
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
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
