import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export const WEDDING_DATE = new Date("2027-05-22T16:00:00-03:00");

export const COUPLE_WHATSAPP = process.env.NEXT_PUBLIC_COUPLE_WHATSAPP || "";

export function formatDatePtBr(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrencyBrl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
