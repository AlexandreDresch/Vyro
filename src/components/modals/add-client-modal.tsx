import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { uid } from "../../utils/helpers";
import { ButtonRow } from "../common/button-row";
import { Field } from "../common/field";
import { Modal } from "../common/modal";

interface AddClientModalProps {
  onClose: () => void;
  onSave?: (client: any) => void;
}

export function AddClientModal({ onClose, onSave }: AddClientModalProps) {
  const { addClient } = useDB();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    const newClient = {
      id: uid(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      totalPurchases: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    if (onSave) {
      onSave(newClient);
    } else {
      addClient(newClient);
    }
    onClose();
  };

  const formatPhoneNumber = (text: string) => {
    // Basic phone formatting (Brazilian format)
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

  return (
    <Modal title="New Client" onClose={onClose}>
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
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="email@example.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Phone Number">
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="+55 11 91234-5678"
            placeholderTextColor="#666"
            value={phone}
            onChangeText={handlePhoneChange}
          />
        </Field>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            The client's total purchases will update automatically when sales
            are added.
          </Text>
        </View>

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Add Client"
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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(232,184,75,0.1)",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#e8b84b",
    lineHeight: 16,
  },
});
