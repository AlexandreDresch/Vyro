import React, { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { Client } from "../../types";
import { fmt } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onSave?: (updatedClient: Client) => void;
}

export function EditClientModal({
  client,
  onClose,
  onSave,
}: EditClientModalProps) {
  const { db, updateClient } = useDB();
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [color, setColor] = useState(client.color);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setColor(client.color);
  }, [client]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Client name is required";
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const updatedClient: Client = {
      ...client,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      color,
    };

    const salesCount =
      db?.sales.filter((s) => s.clientId === client.id).length || 0;

    if (salesCount > 0 && client.name !== name.trim()) {
      Alert.alert(
        "Warning",
        `This client has ${salesCount} sale(s). Changing their name will affect historical data. Continue?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              if (onSave) {
                onSave(updatedClient);
              } else {
                updateClient(updatedClient);
              }
              onClose();
            },
          },
        ],
      );
    } else {
      if (onSave) {
        onSave(updatedClient);
      } else {
        updateClient(updatedClient);
      }
      onClose();
    }
  };

  const formatPhoneNumber = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhoneNumber(text));
  };

  const getRandomColor = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(newColor);
  };

  const handleEmailPress = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handlePhonePress = () => {
    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\D/g, "")}`);
    }
  };

  const clientStats = db
    ? {
        totalOrders: db.sales.filter((s) => s.clientId === client.id).length,
        totalSpent: db.sales
          .filter((s) => s.clientId === client.id && s.status === "paid")
          .reduce((sum, s) => sum + s.total, 0),
        paidOrders: db.sales.filter(
          (s) => s.clientId === client.id && s.status === "paid",
        ).length,
        pendingOrders: db.sales.filter(
          (s) => s.clientId === client.id && s.status === "pending",
        ).length,
        lastOrderDate: db.sales
          .filter((s) => s.clientId === client.id)
          .sort((a, b) => b.date.localeCompare(a.date))[0]?.date,
      }
    : null;

  return (
    <Modal title="Edit Client" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Field label="Full Name" required error={errors.name}>
          <TextInput
            style={styles.input}
            placeholder="Enter client name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <View style={styles.emailContainer}>
            <TextInput
              style={[styles.input, styles.emailInput]}
              keyboardType="email-address"
              placeholder="email@example.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            {email !== "" && (
              <TouchableOpacity
                onPress={handleEmailPress}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>📧</Text>
              </TouchableOpacity>
            )}
          </View>
        </Field>

        <Field label="Phone Number">
          <View style={styles.phoneContainer}>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
              placeholder="+55 11 91234-5678"
              placeholderTextColor="#666"
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {phone !== "" && (
              <TouchableOpacity
                onPress={handlePhonePress}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>📱</Text>
              </TouchableOpacity>
            )}
          </View>
        </Field>

        <Field label="Client Color">
          <View style={styles.colorContainer}>
            <TouchableOpacity
              style={[styles.colorPreview, { backgroundColor: color }]}
            />
            <TouchableOpacity
              onPress={getRandomColor}
              style={styles.randomColorButton}
            >
              <Text style={styles.randomColorText}>🎨 Random Color</Text>
            </TouchableOpacity>
          </View>
        </Field>

        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={[styles.previewAvatar, { backgroundColor: color }]}>
              <Text style={styles.previewInitials}>
                {name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase() || "?"}
              </Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{name || "Client Name"}</Text>
              <Text style={styles.previewEmail}>{email || "No email"}</Text>
              <Text style={styles.previewPhone}>{phone || "No phone"}</Text>
            </View>
          </View>
        </View>

        {clientStats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>Client Statistics</Text>
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Orders</Text>
                <Text style={styles.statValue}>{clientStats.totalOrders}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Spent</Text>
                <Text style={[styles.statValue, styles.statValueAccent]}>
                  {fmt(clientStats.totalSpent)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Paid Orders</Text>
                <Text style={[styles.statValue, { color: "#6ee7b7" }]}>
                  {clientStats.paidOrders}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Pending Orders</Text>
                <Text style={[styles.statValue, { color: "#fbbf24" }]}>
                  {clientStats.pendingOrders}
                </Text>
              </View>
              {clientStats.lastOrderDate && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Last Order</Text>
                  <Text style={styles.statValue}>
                    {clientStats.lastOrderDate}
                  </Text>
                </View>
              )}
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
  emailContainer: {
    flexDirection: "row",
    gap: 8,
  },
  emailInput: {
    flex: 1,
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 8,
  },
  phoneInput: {
    flex: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 20,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  randomColorButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 12,
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
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  previewInitials: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
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
  previewEmail: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  previewPhone: {
    fontSize: 12,
    color: "#999",
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
});
