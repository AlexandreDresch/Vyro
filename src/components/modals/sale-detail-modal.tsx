import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDB } from "../../hooks/use-database";
import { Sale, Status } from "../../types";
import { fmt, statusColor } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Modal } from "../common/modal";

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
  const { deleteSale } = useDB();

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      deleteSale(sale.id);
      onClose();
    }
  };

  const detailRows = [
    { label: "Product", value: sale.product, highlight: false },
    { label: "Client", value: sale.client, highlight: false },
    { label: "Date", value: sale.date, highlight: false },
    { label: "Quantity", value: String(sale.quantity), highlight: false },
    { label: "Unit Price", value: fmt(sale.price), highlight: false },
    { label: "Total", value: fmt(sale.total), highlight: true },
    { label: "Status", value: sale.status, isStatus: true },
  ];

  return (
    <Modal title="Sale Details" onClose={onClose}>
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
      <ButtonRow
        onCancel={handleDelete}
        onConfirm={onClose}
        confirmLabel="Close"
        cancelLabel="Delete"
      />
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
});
