import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { Sale, Status } from "../../types";
import { fmt } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface EditSaleModalProps {
  sale: Sale;
  onClose: () => void;
  onSave?: (updatedSale: Sale) => void;
}

export function EditSaleModal({ sale, onClose, onSave }: EditSaleModalProps) {
  const { db, updateSale } = useDB();
  const [productId, setProductId] = useState(sale.productId);
  const [clientId, setClientId] = useState(sale.clientId);
  const [quantity, setQuantity] = useState(String(sale.quantity));
  const [date, setDate] = useState(sale.date);
  const [status, setStatus] = useState<Status>(sale.status);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProductId(sale.productId);
    setClientId(sale.clientId);
    setQuantity(String(sale.quantity));
    setDate(sale.date);
    setStatus(sale.status);
  }, [sale]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productId) newErrors.productId = "Product is required";
    if (!clientId) newErrors.clientId = "Client is required";
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1)
      newErrors.quantity = "Quantity must be at least 1";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!db) return;

    const product = db.products.find((p) => p.id === productId);
    const client = db.clients.find((c) => c.id === clientId);
    if (!product || !client) return;

    const qty = parseInt(quantity);
    const oldTotal = sale.total;
    const newTotal = qty * product.price;

    const updatedSale: Sale = {
      ...sale,
      product: product.name,
      productId,
      client: client.name,
      clientId,
      quantity: qty,
      price: product.price,
      total: newTotal,
      date,
      status,
    };

    if (Math.abs(newTotal - oldTotal) > 0) {
      Alert.alert(
        "Confirm Changes",
        `Total will change from ${fmt(oldTotal)} to ${fmt(newTotal)}. Continue?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              if (onSave) {
                onSave(updatedSale);
              } else {
                updateSale(updatedSale);
              }
              onClose();
            },
          },
        ],
      );
    } else {
      if (onSave) {
        onSave(updatedSale);
      } else {
        updateSale(updatedSale);
      }
      onClose();
    }
  };

  if (!db) return null;

  const selectedProduct = db.products.find((p) => p.id === productId);
  const selectedClient = db.clients.find((c) => c.id === clientId);

  return (
    <Modal title="Edit Sale" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Field label="Product" required error={errors.productId}>
          <View style={styles.pickerContainer}>
            {db.products.map((p) => (
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
                <Text style={styles.pickerOptionPrice}>{fmt(p.price)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        <Field label="Client" required error={errors.clientId}>
          <View style={styles.pickerContainer}>
            {db.clients.map((c) => (
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
            ))}
          </View>
        </Field>

        <Field label="Quantity" required error={errors.quantity}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            placeholderTextColor="#666"
          />
        </Field>

        <Field label="Date" required error={errors.date}>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
          />
        </Field>

        <Field label="Status">
          <View style={styles.statusContainer}>
            {(["paid", "pending", "cancelled"] as Status[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusOption,
                  status === s && styles.statusOptionSelected,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === s && styles.statusOptionTextSelected,
                  ]}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        {selectedProduct && selectedClient && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewRowLabel}>Subtotal:</Text>
                <Text style={styles.previewRowValue}>
                  {fmt(parseInt(quantity) * selectedProduct.price)}
                </Text>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewRow}>
                <Text style={styles.previewRowLabel}>Status:</Text>
                <Text
                  style={[
                    styles.previewRowValue,
                    {
                      color:
                        status === "paid"
                          ? "#6ee7b7"
                          : status === "pending"
                            ? "#fbbf24"
                            : "#f87171",
                    },
                  ]}
                >
                  {status}
                </Text>
              </View>
            </View>
          </View>
        )}

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Save Changes"
          cancelLabel="Cancel"
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
  statusOptionText: {
    fontSize: 14,
    color: "#999",
    textTransform: "capitalize",
  },
  statusOptionTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  previewContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  previewCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewRowLabel: {
    fontSize: 13,
    color: "#999",
  },
  previewRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e8b84b",
  },
  previewDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 4,
  },
});
