import { translations } from "../i18n/translations";
import { Language } from "../types";
import { useDB } from "./use-database";

export function useTranslation(overrideLanguage?: Language) {
  const { preferences } = useDB();
  const language = overrideLanguage || preferences?.language || "en";

  const t = translations[language];

  return { t, language };
}
