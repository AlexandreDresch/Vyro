import { Pencil } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDB } from "../../hooks/use-database";
import { Sale, Status } from "../../types";
import { fmt, statusColor } from "../../utils/helpers";
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
  const { deleteSale, updateSale } = useDB();
  const [isEditing, setIsEditing] = useState(false);

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
          <ButtonRow
            onCancel={handleDelete}
            onConfirm={onClose}
            confirmLabel="Close"
            cancelLabel="Delete"
          />

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              Edit Sale{"  "}
              <Pencil
                size={14}
                color={"#e8b84b"}
                style={styles.editButtonIcon}
              />
            </Text>
          </TouchableOpacity>
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
