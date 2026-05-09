import { Status } from "@/src/types";

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const fmt = (n: number) =>
  "R$ " +
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

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
