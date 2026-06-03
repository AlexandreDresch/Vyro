import { translations } from "../i18n/translations";
import { Language } from "../types";
import { useDB } from "./use-database";

export function useTranslation(overrideLanguage?: Language) {
  let preferences = null;
  let language: Language = "en";

  try {
    const dbContext = useDB();
    preferences = dbContext?.preferences;
    language = preferences?.language || overrideLanguage || "en";
  } catch (error) {
    language = overrideLanguage || "en";
  }

  const t = translations[language];

  return { t, language };
}
