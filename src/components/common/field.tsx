import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}

export function Field({
  label,
  children,
  required = false,
  error,
}: FieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  required: {
    color: "#e05252",
  },
  error: {
    fontSize: 10,
    color: "#e05252",
    marginTop: 4,
  },
});
