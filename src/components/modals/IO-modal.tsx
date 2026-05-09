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
import { DB } from "../../types";
import { uid } from "../../utils/helpers";
import { Modal } from "../common/modal";

interface IOModalProps {
  onClose: () => void;
  onImport?: (data: Partial<DB>) => void;
}

export function IOModal({ onClose, onImport }: IOModalProps) {
  const { db, updateDB } = useDB();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Export Failed", String(error));
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
        Alert.alert("Success", `Imported ${totalImported} new records`);
        onClose();
      } else {
        Alert.alert("Info", "No new records found to import");
      }
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Import Failed", String(error));
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset Data",
      "This will delete all your data and restore the sample data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            // Implement reset logic
            Alert.alert("Reset", "Data reset functionality would go here");
          },
        },
      ],
    );
  };

  return (
    <Modal title="Data Management" onClose={onClose}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export</Text>
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
              <Text style={styles.buttonText}>Export as Excel (.xlsx)</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.buttonNote}>
          Export all sales, products, and clients to an Excel file
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Import</Text>
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
              <Text style={styles.buttonText}>Import Excel File</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.buttonNote}>
          Import data from a previously exported file. Existing records are
          preserved.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.button, styles.dangerButton]}
        >
          <Text style={styles.buttonIcon}>
            <TriangleAlert size={20} color="#e05252" />
          </Text>
          <Text style={[styles.buttonText, styles.dangerText]}>
            Reset All Data
          </Text>
        </TouchableOpacity>
        <Text style={styles.buttonNote}>
          This will delete all your data. This action cannot be undone.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Supported formats: .xlsx, .xls</Text>
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
