import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { ChartNoAxesColumn, Import, TriangleAlert } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as XLSX from "xlsx";
import { COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
import { DB } from "../../types";
import { uid } from "../../utils/helpers";
import { persistDB } from "../../utils/storage";
import { Modal } from "../common/modal";

interface IOModalProps {
  onClose: () => void;
  onImport?: (data: Partial<DB>) => void;
  onResetComplete?: () => void;
}

export function IOModal({ onClose, onImport, onResetComplete }: IOModalProps) {
  const { db, updateDB } = useDB();
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExport = async () => {
    if (!db) return;

    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          db.sales.map((s) => ({
            ID: s.id,
            Date: s.date,
            Product: s.product,
            Client: s.client,
            Quantity: s.quantity,
            Price: s.price,
            Total: s.total,
            Status: s.status,
          })),
        ),
        "Sales",
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          db.products.map((p) => ({
            ID: p.id,
            Name: p.name,
            Category: p.category,
            Price: p.price,
            Stock: p.stock,
          })),
        ),
        "Products",
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          db.clients.map((c) => ({
            ID: c.id,
            Name: c.name,
            Email: c.email,
            Phone: c.phone,
            TotalPurchases: c.totalPurchases,
          })),
        ),
        "Clients",
      );

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const fileUri = FileSystem.documentDirectory
        ? `${FileSystem.documentDirectory}vyro-dashboard-${Date.now()}.xlsx`
        : `${FileSystem.cacheDirectory}vyro-dashboard-${Date.now()}.xlsx`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          t.exportFailed || "Error",
          t.sharingNotAvailable || "Sharing is not available on this device",
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(t.exportFailed || "Export Failed", String(error));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const file = result.assets[0];

      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const wb = XLSX.read(fileContent, { type: "base64" });

      if (!db) return;

      const existingIds = new Set([
        ...db.sales.map((s) => s.id),
        ...db.products.map((p) => p.id),
        ...db.clients.map((c) => c.id),
      ]);

      const imported: Partial<DB> = {};

      if (wb.Sheets["Sales"]) {
        const salesData = XLSX.utils.sheet_to_json(wb.Sheets["Sales"]) as any[];
        imported.sales = salesData
          .filter((r) => !existingIds.has(r.ID))
          .map((r) => ({
            id: r.ID || uid(),
            date: r.Date,
            product: r.Product,
            productId: "",
            client: r.Client,
            clientId: "",
            quantity: r.Quantity,
            price: r.Price,
            total: r.Total,
            status: r.Status?.toLowerCase() || "pending",
          }));
      }

      if (wb.Sheets["Products"]) {
        const productsData = XLSX.utils.sheet_to_json(
          wb.Sheets["Products"],
        ) as any[];
        imported.products = productsData
          .filter((r) => !existingIds.has(r.ID))
          .map((r) => ({
            id: r.ID || uid(),
            name: r.Name,
            category: r.Category,
            price: r.Price,
            stock: r.Stock,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          }));
      }

      if (wb.Sheets["Clients"]) {
        const clientsData = XLSX.utils.sheet_to_json(
          wb.Sheets["Clients"],
        ) as any[];
        imported.clients = clientsData
          .filter((r) => !existingIds.has(r.ID))
          .map((r) => ({
            id: r.ID || uid(),
            name: r.Name,
            email: r.Email || "",
            phone: r.Phone || "",
            totalPurchases: r.TotalPurchases || 0,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          }));
      }

      const totalImported =
        (imported.sales?.length || 0) +
        (imported.products?.length || 0) +
        (imported.clients?.length || 0);

      if (totalImported > 0) {
        if (onImport) {
          onImport(imported);
        } else if (db) {
          await updateDB({
            sales: [...db.sales, ...(imported.sales ?? [])],
            products: [...db.products, ...(imported.products ?? [])],
            clients: [...db.clients, ...(imported.clients ?? [])],
          });
        }
        Alert.alert(
          t.importSuccess || "Success",
          `${t.imported} ${totalImported} ${t.newRecords}`,
        );
        onClose();
      } else {
        Alert.alert(
          t.info || "Info",
          t.noNewRecordsFound || "No new records found to import",
        );
      }
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert(t.importFailed || "Import Failed", String(error));
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      t.resetData || "Reset Data",
      t.resetDataWarningFull ||
        "This will delete ALL your data AND preferences. The app will restart as if first launch. This action cannot be undone.",
      [
        { text: t.cancel || "Cancel", style: "cancel" },
        {
          text: t.reset || "Reset",
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);
            try {
              const emptyDB: DB = {
                sales: [],
                products: [],
                clients: [],
              };
              await persistDB(emptyDB);

              await AsyncStorage.removeItem("userPreferences");

              onClose();

              if (onResetComplete) {
                onResetComplete();
              }
            } catch (error) {
              console.error("Reset error:", error);
              Alert.alert(
                t.error || "Error",
                t.resetFailed || "Failed to reset data. Please try again.",
                [{ text: t.confirm || "OK" }],
              );
            } finally {
              setIsResetting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal title={t.dataManagement || "Data Management"} onClose={onClose}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.export}</Text>
        <TouchableOpacity
          onPress={handleExport}
          style={styles.button}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.buttonIcon}>
                <ChartNoAxesColumn size={20} color="#e5e5e5" />
              </Text>
              <Text style={styles.buttonText}>{t.exportAsExcel}</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.buttonNote}>{t.exportDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.import}</Text>
        <TouchableOpacity
          onPress={handleImport}
          style={styles.button}
          disabled={isImporting}
        >
          {isImporting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.buttonIcon}>
                <Import size={20} color="#e5e5e5" />
              </Text>
              <Text style={styles.buttonText}>{t.importExcelFile}</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.buttonNote}>{t.importDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.dangerZone}</Text>
        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.button, styles.dangerButton]}
          disabled={isResetting}
        >
          {isResetting ? (
            <ActivityIndicator color="#e05252" />
          ) : (
            <>
              <Text style={styles.buttonIcon}>
                <TriangleAlert size={20} color="#e05252" />
              </Text>
              <Text style={[styles.buttonText, styles.dangerText]}>
                {t.resetAllData}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.buttonNote}>{t.resetDataWarningShort}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t.supportedFormats}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dangerButton: {
    backgroundColor: "rgba(224,82,82,0.1)",
    borderColor: "rgba(224,82,82,0.3)",
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 14,
    color: "#e5e5e5",
    fontWeight: "500",
  },
  dangerText: {
    color: "#e05252",
  },
  buttonNote: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
  },
});
