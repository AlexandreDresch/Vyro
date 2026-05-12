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

interface SetupScreenProps {
  onComplete: (userPrefs: UserPreferences) => Promise<void>;
}

export interface UserPreferences {
  language: Language;
  currency: Currency;
  useMockData: boolean;
  isFirstLaunch: boolean;
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

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [useMockData, setUseMockData] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));

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
    if (currentStep < 3) {
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
    };

    await AsyncStorage.setItem("userPreferences", JSON.stringify(preferences));
    await onComplete(preferences);
  };

  const getTranslations = () => {
    const translations = {
      pt: {
        title: "Bem-vindo ao Vyro",
        subtitle: "Configure seu painel de vendas",
        languageStep: "Escolha seu idioma",
        currencyStep: "Escolha sua moeda",
        dataStep: "Dados de exemplo",
        useMockData: "Usar dados de exemplo para começar",
        mockDataHelp:
          "Isso criará produtos, clientes e vendas de exemplo para você explorar",
        startFresh: "Começar do zero",
        freshHelp:
          "Comece com um banco de dados vazio e adicione seus próprios dados",
        next: "Próximo",
        back: "Voltar",
        start: "Começar",
        step: "Passo",
        of: "de",
      },
      en: {
        title: "Welcome to Vyro",
        subtitle: "Set up your sales dashboard",
        languageStep: "Choose your language",
        currencyStep: "Choose your currency",
        dataStep: "Sample data",
        useMockData: "Use sample data to get started",
        mockDataHelp:
          "This will create sample products, clients, and sales for you to explore",
        startFresh: "Start from scratch",
        freshHelp: "Start with an empty database and add your own data",
        next: "Next",
        back: "Back",
        start: "Start",
        step: "Step",
        of: "of",
      },
      "es-AR": {
        title: "Bienvenido a Vyro",
        subtitle: "Configure su panel de ventas",
        languageStep: "Elige tu idioma",
        currencyStep: "Elige tu moneda",
        dataStep: "Datos de ejemplo",
        useMockData: "Usar datos de ejemplo para comenzar",
        mockDataHelp:
          "Esto creará productos, clientes y ventas de ejemplo para que explores",
        startFresh: "Comenzar desde cero",
        freshHelp:
          "Comienza con una base de datos vacía y agrega tus propios datos",
        next: "Siguiente",
        back: "Atrás",
        start: "Comenzar",
        step: "Paso",
        of: "de",
      },
    };

    return translations[selectedLanguage] || translations.en;
  };

  const t = getTranslations();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 3) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {t.step} {currentStep} {t.of} 3
        </Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>📊</Text>
            </View>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.languageStep}</Text>
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

          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>{t.currencyStep}</Text>
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
                    <Text style={styles.optionFlag}>{curr.flag}</Text>
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
              <Text style={styles.stepTitle}>{t.dataStep}</Text>

              <TouchableOpacity
                style={[
                  styles.dataOption,
                  useMockData && styles.dataOptionSelected,
                ]}
                onPress={() => setUseMockData(true)}
              >
                <View style={styles.dataOptionHeader}>
                  <Text style={styles.dataOptionIcon}>📦</Text>
                  <Text style={styles.dataOptionTitle}>{t.useMockData}</Text>
                </View>
                <Text style={styles.dataOptionDescription}>
                  {t.mockDataHelp}
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
                <Text style={styles.previewTitle}>Your selection:</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Language:</Text>
                  <Text style={styles.previewValue}>
                    {
                      LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)
                        ?.name
                    }
                  </Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Currency:</Text>
                  <Text style={styles.previewValue}>
                    {
                      CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)
                        ?.name
                    }
                  </Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Data:</Text>
                  <Text style={styles.previewValue}>
                    {useMockData ? "Sample data" : "Empty database"}
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

        {currentStep < 3 ? (
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  logo: {
    fontSize: 40,
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
    marginBottom: 24,
    textAlign: "center",
  },
  optionsGrid: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
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
  optionName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: "#666",
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
