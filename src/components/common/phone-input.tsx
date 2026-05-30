import { AsYouType } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: object;
}

export function PhoneInput({
  value,
  onChangeText,
  placeholder,
  style,
}: PhoneInputProps) {
  const [formattedValue, setFormattedValue] = useState(value);

  // Update formatted value when external value changes
  useEffect(() => {
    if (value !== formattedValue) {
      const asYouType = new AsYouType();
      const formatted = asYouType.input(value);
      setFormattedValue(formatted);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    const asYouType = new AsYouType();
    const formatted = asYouType.input(text);
    setFormattedValue(formatted);
    onChangeText(formatted);
  };

  return (
    <TextInput
      style={[styles.input, style]}
      value={formattedValue}
      onChangeText={handleChangeText}
      placeholder={placeholder || "+1 234 567 8900"}
      placeholderTextColor="#666"
      keyboardType="phone-pad"
    />
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
});
