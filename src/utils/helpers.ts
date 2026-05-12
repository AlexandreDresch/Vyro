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
