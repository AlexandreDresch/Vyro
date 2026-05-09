import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CATEGORIES, COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { uid } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface AddProductModalProps {
  onClose: () => void;
  onSave?: (product: any) => void;
}

export function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const { addProduct } = useDB();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Valid price is required";
    if (!stock || parseInt(stock) < 0)
      newErrors.stock = "Valid stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newProduct = {
      id: uid(),
      name: name.trim(),
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    if (onSave) {
      onSave(newProduct);
    } else {
      addProduct(newProduct);
    }
    onClose();
  };

  return (
    <Modal title="New Product" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Field label="Product Name" required error={errors.name}>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label="Category" required>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryOption,
                  category === cat && styles.categoryOptionSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        <Field label="Price (R$)" required error={errors.price}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#666"
            value={price}
            onChangeText={setPrice}
          />
        </Field>

        <Field label="Stock Quantity" required error={errors.stock}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
            value={stock}
            onChangeText={setStock}
          />
        </Field>

        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={styles.previewCard}>
            <View
              style={[styles.previewColor, { backgroundColor: COLORS[0] }]}
            />
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{name || "Product Name"}</Text>
              <Text style={styles.previewCategory}>{category}</Text>
              <Text style={styles.previewPrice}>
                {price ? `R$ ${parseFloat(price).toFixed(2)}` : "R$ 0.00"}
              </Text>
            </View>
          </View>
        </View>

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Add Product"
        />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryOptionSelected: {
    backgroundColor: "#e8b84b",
    borderColor: "#e8b84b",
  },
  categoryText: {
    fontSize: 12,
    color: "#999",
  },
  categoryTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  previewContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
  },
  previewColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  previewCategory: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  previewPrice: {
    fontSize: 12,
    color: "#e8b84b",
    marginTop: 2,
  },
});
