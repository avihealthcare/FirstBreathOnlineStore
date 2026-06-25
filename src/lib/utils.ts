import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartLine } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateCartTotals(items: CartLine[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

export function buildOrderNumber() {
  const year = new Date().getFullYear();
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AVI-ORD-${year}-${token}`;
}

export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
}

export function isIndianMobile(mobile: string) {
  return /^[6-9]\d{9}$/.test(normalizeMobile(mobile));
}
