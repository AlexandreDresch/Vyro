import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/components/navigation/app-navigator";
import { DBProvider } from "./src/hooks/use-database";

export default function App() {
  return (
    <DBProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <AppNavigator />
      </SafeAreaProvider>
    </DBProvider>
  );
}
