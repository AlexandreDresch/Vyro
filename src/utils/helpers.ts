import { Currency, Status } from "@/src/types";

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const formatCurrency = (
  amount: number,
  currency: Currency = "BRL",
): string => {
  switch (currency) {
    case "BRL":
      return amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "USD":
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "ARS":
      return amount.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    default:
      return `R$ ${amount.toFixed(2)}`;
  }
};

export const fmt = (amount: number, currency?: Currency): string => {
  return formatCurrency(amount, currency);
};

export const formatDate = (
  dateString: string,
  language: string = "en",
): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const locale =
    language === "pt" ? "pt-BR" : language === "es-AR" ? "es-AR" : "en-US";
  return date.toLocaleDateString(locale, options);
};

export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const statusColor: Record<Status, { bg: string; text: string }> = {
  paid: { bg: "#1a3a2a", text: "#6ee7b7" },
  pending: { bg: "#3a2e1a", text: "#fbbf24" },
  cancelled: { bg: "#3a1a1a", text: "#f87171" },
};

export const formatLargeNumber = (num: number, _currency?: string): string => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1_000_000_000) {
    const formatted = (absNum / 1_000_000_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${cleanFormatted}B`;
  } else if (absNum >= 1_000_000) {
    const formatted = (absNum / 1_000_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${cleanFormatted}M`;
  } else if (absNum >= 1_000) {
    const formatted = (absNum / 1_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${cleanFormatted}K`;
  }

  return `${sign}${absNum}`;
};

export const formatLargeCurrency = (
  amount: number,
  currencyCode: string = "BRL",
): string => {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  const getCurrencySymbol = (code: string): string => {
    switch (code) {
      case "BRL":
        return "R$";
      case "USD":
        return "$";
      case "ARS":
        return "$";
      default:
        return "R$";
    }
  };

  const symbol = getCurrencySymbol(currencyCode);

  if (absAmount >= 1_000_000_000) {
    const formatted = (absAmount / 1_000_000_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${symbol} ${cleanFormatted}B`;
  } else if (absAmount >= 1_000_000) {
    const formatted = (absAmount / 1_000_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${symbol} ${cleanFormatted}M`;
  } else if (absAmount >= 1_000) {
    const formatted = (absAmount / 1_000).toFixed(1);
    const cleanFormatted = formatted.endsWith(".0")
      ? formatted.slice(0, -2)
      : formatted;
    return `${sign}${symbol} ${cleanFormatted}K`;
  }

  return `${sign}${symbol} ${absAmount.toFixed(2)}`;
};

export const smartFormat = (num: number, currencyCode?: string): string => {
  if (currencyCode) {
    return formatLargeCurrency(num, currencyCode);
  }
  return formatLargeNumber(num);
};

export const formatNumberFull = (num: number): string => {
  return num.toLocaleString("en-US");
};

export const formatCurrencyFull = (
  amount: number,
  currencyCode: string = "BRL",
): string => {
  const getCurrencySymbol = (code: string): string => {
    switch (code) {
      case "BRL":
        return "R$";
      case "USD":
        return "$";
      case "ARS":
        return "$";
      default:
        return "R$";
    }
  };

  const symbol = getCurrencySymbol(currencyCode);
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return amount < 0 ? `-${symbol} ${formatted}` : `${symbol} ${formatted}`;
};
