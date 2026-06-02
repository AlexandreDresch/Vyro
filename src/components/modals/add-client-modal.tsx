import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../constants";
import { useDB } from "../../hooks/use-database";
import { useTranslation } from "../../hooks/use-translation";
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
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.clientNameRequired;
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = t.invalidEmailFormat;
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

  const handlePhoneChange = (text: string) => {
    setPhone(text.replace(/\D/g, ""));
  };

  return (
    <Modal title={t.newClient} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Field label={t.fullName} required error={errors.name}>
          <TextInput
            style={styles.input}
            placeholder={t.enterClientName}
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </Field>

        <Field label={t.email} error={errors.email}>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder={t.emailExample}
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Field>

        <Field label={t.phone}>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder={t.phoneExample}
            placeholderTextColor="#666"
            value={phone}
            onChangeText={handlePhoneChange}
          />
        </Field>

        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>{t.clientInfoMessage}</Text>
        </View>

        <ButtonRow
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel={t.addClient}
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
