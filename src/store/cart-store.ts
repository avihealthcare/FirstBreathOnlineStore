"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";

type CartState = {
  items: CartLine[];
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
};

function buildCartLine(product: Product, quantity = 1, variant?: string): CartLine {
  const variantToken = variant ? variant.toLowerCase().replace(/\s+/g, "-") : "default";
  return {
    id: `${product.slug}-${variantToken}`,
    productSlug: product.slug,
    name: product.name,
    sku: product.sku,
    image: product.images[0],
    price: product.salePrice ?? product.price,
    variant,
    quantity
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variant) => {
        const line = buildCartLine(product, quantity, variant);
        const existing = get().items.find((item) => item.id === line.id);

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === line.id ? { ...item, quantity: item.quantity + quantity } : item
            )
          });
          return;
        }

        set({ items: [...get().items, line] });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item))
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: "avi-firstbreath-cart"
    }
  )
);
