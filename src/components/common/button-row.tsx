import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonRowProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
}

export function ButtonRow({
  onCancel,
  onConfirm,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  confirmDisabled = false,
}: ButtonRowProps) {
  return (
    <View style={styles.btnRow}>
      <TouchableOpacity
        onPress={onCancel}
        style={[styles.btnCancel, styles.btn]}
        disabled={isLoading}
      >
        <Text style={styles.btnCancelText}>{cancelLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onConfirm}
        style={[styles.btn, styles.btnConfirm]}
        disabled={isLoading || confirmDisabled}
      >
        <Text style={styles.btnConfirmText}>
          {isLoading ? "Loading..." : confirmLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  btnCancelText: {
    color: "#999",
    fontSize: 14,
  },
  btnConfirm: {
    backgroundColor: "#e8b84b",
  },
  btnConfirmText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});
