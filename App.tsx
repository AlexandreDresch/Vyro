import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/components/navigation/app-navigator";
import {
  SetupScreen,
  UserPreferences,
} from "./src/components/screens/setup-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DBProvider } from "./src/hooks/use-database";
import { buildSeedData } from "./src/utils/seed-data";
import { persistDB } from "./src/utils/storage";

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const prefs = await AsyncStorage.getItem("userPreferences");
      if (prefs) {
        const userPrefs = JSON.parse(prefs);
        setPreferences(userPrefs);
        setIsFirstLaunch(false);
      } else {
        setIsFirstLaunch(true);
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
      setIsFirstLaunch(true);
    }
  };

  const handleSetupComplete = async (userPrefs: UserPreferences) => {
    setPreferences(userPrefs);
    setIsFirstLaunch(false);

    if (userPrefs.useMockData) {
      const seedData = buildSeedData();
      await persistDB(seedData);
    } else {
      await persistDB({ sales: [], products: [], clients: [] });
    }
  };

  if (isFirstLaunch === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0a0a0a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#e8b84b" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <SetupScreen onComplete={handleSetupComplete} />
      </SafeAreaProvider>
    );
  }

  return (
    <DBProvider preferences={preferences}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <AppNavigator />
      </SafeAreaProvider>
    </DBProvider>
  );
}
