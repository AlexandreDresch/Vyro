import { Currency, Language } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "../../hooks/use-translation";

interface SetupScreenProps {
  onComplete: (userPrefs: UserPreferences) => Promise<void>;
}

export interface UserPreferences {
  language: Language;
  currency: Currency;
  useMockData: boolean;
  isFirstLaunch: boolean;
  stockBehavior: "reserve" | "no_reserve";
}

const LANGUAGE_OPTIONS = [
  { code: "pt", name: "Português", flag: "🇧🇷", label: "Brazilian Portuguese" },
  { code: "en", name: "English", flag: "🇺🇸", label: "English" },
  { code: "es-AR", name: "Español", flag: "🇦🇷", label: "Argentinian Spanish" },
];

const CURRENCY_OPTIONS = [
  { code: "BRL", symbol: "R$", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "ARS", symbol: "$", name: "Peso Argentino", flag: "🇦🇷" },
];

const STOCK_BEHAVIOR_OPTIONS = [
  {
    id: "reserve",
    icon: "🔒",
    title: "Reserve Stock",
    description:
      "Pending orders reduce stock (reserve inventory for pay-later customers)",
  },
  {
    id: "no_reserve",
    icon: "🔓",
    title: "Don't Reserve Stock",
    description: "Pending orders don't affect stock (manual stock management)",
  },
];

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [useMockData, setUseMockData] = useState(true);
  const [stockBehavior, setStockBehavior] = useState<"reserve" | "no_reserve">(
    "reserve",
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));

  const { t } = useTranslation(selectedLanguage);

  const animateTransition = (nextStep: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setCurrentStep(nextStep));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      animateTransition(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    const preferences: UserPreferences = {
      language: selectedLanguage,
      currency: selectedCurrency,
      useMockData,
      isFirstLaunch: false,
      stockBehavior,
    };

    await AsyncStorage.setItem("userPreferences", JSON.stringify(preferences));
    await onComplete(preferences);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 4) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {t.step} {currentStep} {t.of} 4
        </Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t.welcome}</Text>
            <Text style={styles.subtitle}>{t.setupDashboard}</Text>
          </View>

          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.chooseLanguage}</Text>
              <View style={styles.optionsGrid}>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.optionCard,
                      selectedLanguage === lang.code &&
                        styles.optionCardSelected,
                    ]}
                    onPress={() => setSelectedLanguage(lang.code as Language)}
                  >
                    <Text style={styles.optionFlag}>{lang.flag}</Text>
                    <Text style={styles.optionName}>{lang.name}</Text>
                    <Text style={styles.optionLabel}>{lang.label}</Text>
                    {selectedLanguage === lang.code && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Currency */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.chooseCurrency}</Text>
              <View style={styles.optionsGrid}>
                {CURRENCY_OPTIONS.map((curr) => (
                  <TouchableOpacity
                    key={curr.code}
                    style={[
                      styles.optionCard,
                      selectedCurrency === curr.code &&
                        styles.optionCardSelected,
                    ]}
                    onPress={() => setSelectedCurrency(curr.code as Currency)}
                  >
                    <Text style={styles.currencySymbol}>{curr.symbol}</Text>
                    <Text style={styles.optionName}>{curr.name}</Text>
                    {selectedCurrency === curr.code && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.stockBehavior}</Text>
              <Text style={styles.stepDescription}>
                {t.stockBehaviorDescription}
              </Text>
              <View style={styles.optionsGrid}>
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    stockBehavior === "reserve" && styles.optionCardSelected,
                  ]}
                  onPress={() => setStockBehavior("reserve")}
                >
                  <Text style={styles.behaviorIcon}>🔒</Text>
                  <Text style={styles.optionName}>{t.reserveStockTitle}</Text>
                  <Text style={styles.optionDescription}>
                    {t.reserveStockDescription}
                  </Text>
                  {stockBehavior === "reserve" && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    stockBehavior === "no_reserve" && styles.optionCardSelected,
                  ]}
                  onPress={() => setStockBehavior("no_reserve")}
                >
                  <Text style={styles.behaviorIcon}>🔓</Text>
                  <Text style={styles.optionName}>
                    {t.notReserveStockTitle}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t.notReserveStockDescription}
                  </Text>
                  {stockBehavior === "no_reserve" && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {currentStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.sampleData}</Text>

              <TouchableOpacity
                style={[
                  styles.dataOption,
                  useMockData && styles.dataOptionSelected,
                ]}
                onPress={() => setUseMockData(true)}
              >
                <View style={styles.dataOptionHeader}>
                  <Text style={styles.dataOptionIcon}>📦</Text>
                  <Text style={styles.dataOptionTitle}>{t.useSampleData}</Text>
                </View>
                <Text style={styles.dataOptionDescription}>
                  {t.sampleDataHelp}
                </Text>
                {useMockData && (
                  <View style={styles.dataCheckmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dataOption,
                  !useMockData && styles.dataOptionSelected,
                ]}
                onPress={() => setUseMockData(false)}
              >
                <View style={styles.dataOptionHeader}>
                  <Text style={styles.dataOptionIcon}>✨</Text>
                  <Text style={styles.dataOptionTitle}>{t.startFresh}</Text>
                </View>
                <Text style={styles.dataOptionDescription}>{t.freshHelp}</Text>
                {!useMockData && (
                  <View style={styles.dataCheckmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>{t.yourSelection}:</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>{t.language}:</Text>
                  <Text style={styles.previewValue}>
                    {
                      LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)
                        ?.name
                    }
                  </Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>{t.currency}:</Text>
                  <Text style={styles.previewValue}>
                    {
                      CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)
                        ?.name
                    }
                  </Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>
                    {t.stockBehaviorLabel}:
                  </Text>
                  <Text style={styles.previewValue}>
                    {stockBehavior === "reserve"
                      ? STOCK_BEHAVIOR_OPTIONS[0].title
                      : STOCK_BEHAVIOR_OPTIONS[1].title}
                  </Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>{t.data}:</Text>
                  <Text style={styles.previewValue}>
                    {useMockData ? t.sampleData : t.startFresh}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.navButtonBack}>
            <Text style={styles.navButtonBackText}>{t.back}</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.navButtonNext,
              currentStep === 1 && styles.navButtonFull,
            ]}
          >
            <Text style={styles.navButtonNextText}>{t.next}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleComplete}
            style={[styles.navButtonNext, styles.navButtonFull]}
          >
            <Text style={styles.navButtonNextText}>{t.start}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#e8b84b",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  stepContainer: {
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsGrid: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 5,
    alignItems: "center",
    position: "relative",
  },
  optionCardSelected: {
    borderColor: "#e8b84b",
    backgroundColor: "rgba(232,184,75,0.1)",
  },
  optionFlag: {
    fontSize: 48,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
    color: "#e8b84b",
    marginBottom: 8,
  },
  behaviorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  optionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: "#666",
  },
  optionDescription: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e8b84b",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  dataOption: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: "relative",
  },
  dataOptionSelected: {
    borderColor: "#e8b84b",
    backgroundColor: "rgba(232,184,75,0.1)",
  },
  dataOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  dataOptionIcon: {
    fontSize: 24,
  },
  dataOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  dataOptionDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  dataCheckmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e8b84b",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e8b84b",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  previewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: "#666",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  navigation: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  navButtonBack: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  navButtonBackText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  navButtonNext: {
    flex: 1,
    backgroundColor: "#e8b84b",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  navButtonFull: {
    flex: 1,
  },
  navButtonNextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
