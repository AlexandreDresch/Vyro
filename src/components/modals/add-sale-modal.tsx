import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDB } from "../../hooks/use-database";
import { Status } from "../../types";
import { uid } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface AddSaleModalProps {
  onClose: () => void;
  onSave?: (sale: any) => void;
}

export function AddSaleModal({ onClose, onSave }: AddSaleModalProps) {
  const { db, addSale } = useDB();
  const [productId, setProductId] = useState(db?.products[0]?.id ?? "");
  const [clientId, setClientId] = useState(db?.clients[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<Status>("paid");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const newSale = {
      id: uid(),
      date,
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

  if (!db) return null;

  return (
    <Modal title="New Sale" onClose={onClose}>
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
                <Text style={styles.pickerOptionPrice}>{p.price}</Text>
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

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Add Sale"
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
});
