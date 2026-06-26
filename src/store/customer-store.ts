"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockOrders } from "@/lib/data";
import { buildOrderNumber } from "@/lib/utils";
import type { Address, CustomerOrder, CustomerProfile, OrderItem } from "@/types";

type CustomerState = {
  customer: CustomerProfile | null;
  orders: CustomerOrder[];
  isLoggedIn: boolean;
  setCustomer: (customer: CustomerProfile | null) => void;
  logout: () => void;
  updateProfile: (profile: Partial<CustomerProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  addOrder: (order: Omit<CustomerOrder, "id" | "orderNumber" | "createdAt">) => CustomerOrder;
  recordOrder: (order: CustomerOrder) => void;
  saveProduct: (slug: string) => void;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customer: null,
      orders: mockOrders,
      isLoggedIn: false,
      setCustomer: (customer) => set({ customer, isLoggedIn: Boolean(customer) }),
      logout: () => set({ customer: null, isLoggedIn: false }),
      updateProfile: (profile) => {
        const current = get().customer;
        if (!current) return;
        set({ customer: { ...current, ...profile } });
      },
      addAddress: (address) => {
        const current = get().customer;
        if (!current) return;
        const nextAddress: Address = { ...address, id: `addr-${Date.now()}` };
        const addresses = nextAddress.isDefault
          ? current.addresses.map((item) => ({ ...item, isDefault: false }))
          : current.addresses;

        set({ customer: { ...current, addresses: [...addresses, nextAddress] } });
      },
      updateAddress: (id, address) => {
        const current = get().customer;
        if (!current) return;
        set({
          customer: {
            ...current,
            addresses: current.addresses.map((item) =>
              item.id === id ? { ...item, ...address } : address.isDefault ? { ...item, isDefault: false } : item
            )
          }
        });
      },
      addOrder: (order) => {
        const items = order.items as OrderItem[];
        const nextOrder: CustomerOrder = {
          ...order,
          items,
          id: `order-${Date.now()}`,
          orderNumber: buildOrderNumber(),
          createdAt: new Date().toISOString()
        };
        const current = get().customer;
        const recentlyPurchasedSlugs = Array.from(new Set(items.map((item) => item.productSlug)));
        set({
          orders: [nextOrder, ...get().orders],
          customer: current
            ? {
                ...current,
                recentlyPurchasedSlugs: Array.from(
                  new Set([...recentlyPurchasedSlugs, ...current.recentlyPurchasedSlugs])
                )
              }
            : current
        });
        return nextOrder;
      },
      recordOrder: (order) => {
        set({ orders: [order, ...get().orders.filter((item) => item.id !== order.id)] });
      },
      saveProduct: (slug) => {
        const current = get().customer;
        if (!current) return;
        set({
          customer: {
            ...current,
            savedProductSlugs: Array.from(new Set([slug, ...current.savedProductSlugs]))
          }
        });
      }
    }),
    {
      name: "avi-firstbreath-customer"
    }
  )
);
