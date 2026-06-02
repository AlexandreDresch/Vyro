import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { Status } from "../../types";
import { formatCurrency, formatDate, uid } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface AddSaleModalProps {
  onClose: () => void;
  onSave?: (sale: any) => void;
}

export function AddSaleModal({ onClose, onSave }: AddSaleModalProps) {
  const { db, addSale, preferences } = useDB();
  const { t, language } = useTranslation();
  const [productId, setProductId] = useState(db?.products[0]?.id ?? "");
  const [clientId, setClientId] = useState(db?.clients[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<Status>("paid");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState(db?.products[0]);

  const currency = preferences?.currency || "BRL";

  useEffect(() => {
    const product = db?.products.find((p) => p.id === productId);
    setSelectedProduct(product);
  }, [productId, db]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productId) newErrors.productId = t.productRequired;
    if (!clientId) newErrors.clientId = t.clientRequired;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) newErrors.quantity = t.quantityMinOne;
    if (!date) newErrors.date = t.dateRequired;

    if (selectedProduct && status === "paid") {
      const qty = parseInt(quantity);
      if (!isNaN(qty) && qty > selectedProduct.stock) {
        newErrors.quantity = t.onlyXUnitsAvailable.replace(
          "{stock}",
          String(selectedProduct.stock),
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!db || !preferences) return;

    const product = db.products.find((p) => p.id === productId);
    const client = db.clients.find((c) => c.id === clientId);
    if (!product || !client) return;

    const qty = parseInt(quantity);

    const needsStock =
      status === "paid" ||
      (status === "pending" && preferences.stockBehavior === "reserve");

    if (needsStock && product.stock < qty) {
      Alert.alert(
        t.insufficientStock || "Insufficient Stock",
        `Only ${product.stock} units available. Please reduce the quantity.`,
        [{ text: t.confirm || "OK" }],
      );
      return;
    }

    if (status === "pending" && preferences.stockBehavior === "reserve") {
      Alert.alert(
        t.reserveStock || "Reserve Stock",
        `This will reserve ${qty} unit(s) from stock. The customer can pay later.`,
        [
          { text: t.cancel, style: "cancel" },
          {
            text: t.confirm,
            onPress: () => {
              const newSale = {
                id: uid(),
                date: date.toString(),
                product: product.name,
                productId,
                client: client.name,
                clientId,
                quantity: qty,
                price: product.price,
                total: qty * product.price,
                status,
              };

              if (onSave) {
                onSave(newSale);
              } else {
                addSale(newSale);
              }
              onClose();
            },
          },
        ],
      );
      return;
    }

    const newSale = {
      id: uid(),
      date: date.toString(),
      product: product.name,
      productId,
      client: client.name,
      clientId,
      quantity: qty,
      price: product.price,
      total: qty * product.price,
      status,
    };

    if (onSave) {
      onSave(newSale);
    } else {
      addSale(newSale);
    }
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  if (!db) return null;

  const qtyNum = parseInt(quantity) || 0;
  const totalAmount = selectedProduct ? qtyNum * selectedProduct.price : 0;
  const isLowStock =
    selectedProduct && selectedProduct.stock < 10 && selectedProduct.stock > 0;
  const isOutOfStock = selectedProduct && selectedProduct.stock === 0;

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

  return (
    <Modal title={t.newSale} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Field label={t.product} required error={errors.productId}>
          <View style={styles.pickerContainer}>
            {db.products.length === 0 ? (
              <Text style={styles.emptyText}>
                {t.noProductsAvailable} {t.pleaseAddProductFirst}
              </Text>
            ) : (
              db.products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.pickerOption,
                    productId === p.id && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setProductId(p.id)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      productId === p.id && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {p.name}
                  </Text>
                  <Text style={styles.pickerOptionPrice}>
                    {formatCurrency(p.price, currency)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Field>

        {selectedProduct && (
          <View
            style={[
              styles.stockInfo,
              isOutOfStock && styles.stockInfoOut,
              isLowStock && styles.stockInfoLow,
            ]}
          >
            <Text style={styles.stockInfoLabel}>{t.availableStock}:</Text>
            <Text
              style={[
                styles.stockInfoValue,
                isOutOfStock && styles.stockInfoValueOut,
                isLowStock && styles.stockInfoValueLow,
              ]}
            >
              {selectedProduct.stock} {t.units}
            </Text>
          </View>
        )}

        <Field label={t.client} required error={errors.clientId}>
          <View style={styles.pickerContainer}>
            {db.clients.length === 0 ? (
              <Text style={styles.emptyText}>
                {t.noClientsAvailable} {t.pleaseAddClientFirst}
              </Text>
            ) : (
              db.clients.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.pickerOption,
                    clientId === c.id && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setClientId(c.id)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      clientId === c.id && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Field>

        <Field label={t.quantity} required error={errors.quantity}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder={t.enterQuantity}
            placeholderTextColor="#666"
          />
        </Field>

        {selectedProduct && qtyNum > 0 && (
          <View style={styles.totalPreview}>
            <Text style={styles.totalPreviewLabel}>{t.totalPreview}</Text>
            <Text style={styles.totalPreviewValue}>
              {formatCurrency(totalAmount, currency)}
            </Text>
          </View>
        )}

        <Field label={t.date} required error={errors.date}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatepicker}
          >
            <Text style={styles.datePickerButtonText}>
              {formatDate(date.toISOString(), language)}
            </Text>
            <Text style={styles.datePickerIcon}>📅</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </Field>

        <Field label={t.status}>
          <View style={styles.statusContainer}>
            {(["paid", "pending", "cancelled"] as Status[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusOption,
                  status === s && styles.statusOptionSelected,
                  status === "paid" &&
                    s === "paid" &&
                    isOutOfStock &&
                    styles.statusOptionDisabled,
                ]}
                onPress={() => {
                  if (s === "paid" && isOutOfStock) {
                    Alert.alert(t.outOfStock, t.outOfStockWarningSubtext, [
                      { text: t.confirm },
                    ]);
                    return;
                  }
                  setStatus(s);
                }}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === s && styles.statusOptionTextSelected,
                    status === "paid" &&
                      s === "paid" &&
                      isOutOfStock &&
                      styles.statusOptionTextDisabled,
                  ]}
                >
                  {getStatusText(s)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        {isOutOfStock && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{t.outOfStockWarning}</Text>
            <Text style={styles.warningSubtext}>
              {t.outOfStockWarningSubtext}
            </Text>
          </View>
        )}

        {isLowStock && status === "paid" && (
          <View style={styles.lowStockWarning}>
            <Text style={styles.lowStockWarningText}>{t.lowStockWarning}</Text>
            <Text style={styles.lowStockWarningSubtext}>
              {t.lowStockWarningSubtext.replace(
                "{stock}",
                String(selectedProduct?.stock),
              )}
            </Text>
          </View>
        )}

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel={t.addSale}
        />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    gap: 8,
  },
  pickerOption: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerOptionSelected: {
    backgroundColor: "#e8b84b",
    borderColor: "#e8b84b",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#999",
  },
  pickerOptionTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  pickerOptionPrice: {
    fontSize: 12,
    color: "#e8b84b",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#fff",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  datePickerButtonText: {
    fontSize: 14,
    color: "#fff",
  },
  datePickerIcon: {
    fontSize: 20,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusOption: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: "#e8b84b",
    borderColor: "#e8b84b",
  },
  statusOptionDisabled: {
    opacity: 0.5,
  },
  statusOptionText: {
    fontSize: 14,
    color: "#999",
    textTransform: "capitalize",
  },
  statusOptionTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  statusOptionTextDisabled: {
    color: "#666",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
  },
  stockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  stockInfoLow: {
    backgroundColor: "rgba(251,191,36,0.1)",
    borderColor: "rgba(251,191,36,0.3)",
  },
  stockInfoOut: {
    backgroundColor: "rgba(248,113,113,0.1)",
    borderColor: "rgba(248,113,113,0.3)",
  },
  stockInfoLabel: {
    fontSize: 13,
    color: "#999",
  },
  stockInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6ee7b7",
  },
  stockInfoValueLow: {
    color: "#fbbf24",
  },
  stockInfoValueOut: {
    color: "#f87171",
  },
  totalPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  totalPreviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e8b84b",
  },
  totalPreviewValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e8b84b",
  },
  warningContainer: {
    backgroundColor: "rgba(248,113,113,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
  },
  warningText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f87171",
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 12,
    color: "#f87171",
    opacity: 0.8,
  },
  lowStockWarning: {
    backgroundColor: "rgba(251,191,36,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
  },
  lowStockWarningText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fbbf24",
    marginBottom: 4,
  },
  lowStockWarningSubtext: {
    fontSize: 12,
    color: "#fbbf24",
    opacity: 0.8,
  },
});
