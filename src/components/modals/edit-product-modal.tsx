import { formatLargeCurrency } from "@/src/utils/helpers";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIES, COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { Product } from "../../types";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave?: (updatedProduct: Product) => void;
}

export function EditProductModal({
  product,
  onClose,
  onSave,
}: EditProductModalProps) {
  const { db, updateProduct, preferences } = useDB();
  const { t } = useTranslation();
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [color, setColor] = useState(product.color);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currency = preferences?.currency || "BRL";

  useEffect(() => {
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setColor(product.color);
  }, [product]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.productNameRequired;
    if (!price || parseFloat(price) <= 0)
      newErrors.price = t.validPriceRequired;
    if (!stock || parseInt(stock) < 0) newErrors.stock = t.validStockRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTranslatedCategory = (cat: string): string => {
    const categoryMap: Record<string, string> = {
      Electronics: t.categoryElectronics,
      Clothing: t.categoryClothing,
      Food: t.categoryFood,
      Home: t.categoryHome,
      Beauty: t.categoryBeauty,
      Sports: t.categorySports,
      Toys: t.categoryToys,
      Books: t.categoryBooks,
      Health: t.categoryHealth,
      Automotive: t.categoryAutomotive,
      Others: t.categoryOthers,
    };
    return categoryMap[cat] || cat;
  };

  const handleSave = () => {
    if (!validate()) return;

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      color,
    };

    const salesCount =
      db?.sales.filter((s) => s.productId === product.id).length || 0;

    if (
      salesCount > 0 &&
      (product.price !== parseFloat(price) || product.name !== name.trim())
    ) {
      Alert.alert(
        t.importantNotice,
        t.productHasHistoricalSales.replace("{count}", String(salesCount)) +
          "\n\n" +
          t.changesAffectFutureSalesOnly +
          "\n\n" +
          t.continueQuestion,
        [
          { text: t.cancel, style: "cancel" },
          {
            text: t.continue,
            onPress: () => {
              if (onSave) {
                onSave(updatedProduct);
              } else {
                updateProduct(updatedProduct, true);
              }
              onClose();
            },
          },
        ],
      );
    } else {
      if (onSave) {
        onSave(updatedProduct);
      } else {
        updateProduct(updatedProduct, true);
      }
      onClose();
    }
  };

  const getRandomColor = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(newColor);
  };

  const salesCount =
    db?.sales.filter((s) => s.productId === product.id).length || 0;
  const historicalRevenue =
    db?.sales
      .filter((s) => s.productId === product.id && s.status === "paid")
      .reduce((sum, s) => sum + s.total, 0) || 0;

  return (
    <Modal title={t.editProduct} onClose={onClose}>
      <View style={styles.modalContent}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          {salesCount > 0 && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                {t.productHasHistoricalSales.replace(
                  "{count}",
                  String(salesCount),
                )}{" "}
                {t.changesAffectFutureOnly}
              </Text>
            </View>
          )}

          <Field label={t.productName} required error={errors.name}>
            <TextInput
              style={styles.input}
              placeholder={t.enterProductName}
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
            {salesCount > 0 && product.name !== name && (
              <Text style={styles.hintText}>
                {t.currentNameInSales
                  .replace("{count}", String(salesCount))
                  .replace("{name}", product.name)}
              </Text>
            )}
          </Field>

          <Field label={t.category} required>
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
                    {getTranslatedCategory(cat)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label={t.price} required error={errors.price}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#666"
              value={price}
              onChangeText={setPrice}
            />
            {salesCount > 0 && product.price !== parseFloat(price) && (
              <Text style={styles.hintText}>
                {t.historicalPrice
                  .replace(
                    "{price}",
                    formatLargeCurrency(product.price, currency),
                  )
                  .replace("{count}", String(salesCount))}
              </Text>
            )}
          </Field>

          <Field label={t.stockQuantity} required error={errors.stock}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#666"
              value={stock}
              onChangeText={setStock}
            />
          </Field>

          <Field label={t.productColor}>
            <View style={styles.colorContainer}>
              <TouchableOpacity
                style={[styles.colorPreview, { backgroundColor: color }]}
              />
              <TouchableOpacity
                onPress={getRandomColor}
                style={styles.randomColorButton}
              >
                <Text style={styles.randomColorText}>{t.randomColor}</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>{t.previewFutureSales}</Text>
            <View style={styles.previewCard}>
              <View style={[styles.previewColor, { backgroundColor: color }]} />
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{name || t.productName}</Text>
                <Text style={styles.previewCategory}>
                  {getTranslatedCategory(category)}
                </Text>
                <Text style={styles.previewPrice}>
                  {price
                    ? formatLargeCurrency(parseFloat(price), currency)
                    : formatLargeCurrency(0, currency)}
                </Text>
                <View style={styles.previewStock}>
                  <Text style={styles.previewStockLabel}>{t.stock}:</Text>
                  <Text style={styles.previewStockValue}>
                    {stock || 0} {t.units}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {salesCount > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsLabel}>{t.historicalSalesData}</Text>
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>{t.totalSales}</Text>
                  <Text style={styles.statValue}>{salesCount}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>{t.historicalRevenue}</Text>
                  <Text style={[styles.statValue, styles.statValueAccent]}>
                    {formatLargeCurrency(historicalRevenue, currency)}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <Text style={styles.statNote}>{t.historicalDataNote}</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <ButtonRow
              onCancel={onClose}
              onConfirm={handleSave}
              confirmLabel={t.saveChanges}
              cancelLabel={t.cancel}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: SCREEN_HEIGHT * 0.85,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
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
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(251,191,36,0.1)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#fbbf24",
    lineHeight: 16,
  },
  hintText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
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
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  randomColorButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  randomColorText: {
    fontSize: 14,
    color: "#e5e5e5",
  },
  previewContainer: {
    marginTop: 20,
    marginBottom: 16,
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e8b84b",
    marginBottom: 4,
  },
  previewStock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewStockLabel: {
    fontSize: 11,
    color: "#666",
  },
  previewStockValue: {
    fontSize: 12,
    color: "#fff",
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  statsCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#999",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  statValueAccent: {
    color: "#e8b84b",
  },
  statDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 8,
  },
  statNote: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 14,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
});
