"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts } from "@/lib/data";
import { defaultCoupons, defaultHeroSettings, defaultPaymentOptions } from "@/lib/defaults";
import type { DiscountCoupon, HeroSettings, PaymentOption, Product, ProductVariant } from "@/types";
import type { AdminProductInput } from "@/lib/validation";

export { defaultCoupons, defaultHeroSettings, defaultPaymentOptions };

type AdminStore = {
  products: Product[];
  hero: HeroSettings;
  paymentOptions: PaymentOption[];
  coupons: DiscountCoupon[];
  saveProduct: (input: AdminProductInput, existingSlug?: string) => Product;
  deleteProduct: (slug: string) => void;
  updateHero: (hero: HeroSettings) => void;
  savePaymentOption: (option: PaymentOption) => void;
  deletePaymentOption: (id: string) => void;
  saveCoupon: (coupon: DiscountCoupon) => void;
  deleteCoupon: (id: string) => void;
  resetStoreSettings: () => void;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function lines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseVariants(value: string): ProductVariant[] {
  return lines(value).map((item, index) => {
    const [name, ...rest] = item.split(":");
    return {
      id: `variant-${index}-${slugify(item)}`,
      name: rest.length ? name.trim() : "Option",
      value: rest.length ? rest.join(":").trim() : item,
      stockQuantity: 25,
      sterile: !/non-sterile/i.test(item)
    };
  });
}

function productFromInput(input: AdminProductInput, existing?: Product): Product {
  const slug = slugify(input.slug || input.name);
  const categorySlug = slugify(input.categorySlug || input.category);
  const price = Number(input.price);
  const salePrice = Number(input.salePrice || 0);
  const tags = lines(input.tags);

  return {
    id: existing?.id ?? `prod-${slug}`,
    name: input.name,
    slug,
    sku: input.sku,
    category: input.category,
    categorySlug,
    shortDescription: input.shortDescription,
    longDescription: input.longDescription,
    price,
    salePrice: salePrice > 0 ? salePrice : undefined,
    images: lines(input.imageUrls),
    tags,
    features: lines(input.features),
    variants: parseVariants(input.variants),
    stockQuantity: Number(input.stockQuantity),
    availability: input.availability,
    rating: existing?.rating ?? 4.6,
    reviewCount: existing?.reviewCount ?? 0,
    shippingInfo: input.shippingDetails,
    popularity: existing?.popularity ?? 50,
    isFeatured: input.isFeatured,
    isNewArrival: input.isNewArrival,
    isBestSeller: input.isBestSeller,
    similarProductSlugs: lines(input.similarProducts ?? "")
  };
}

export function productToAdminInput(product: Product): AdminProductInput {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    salePrice: product.salePrice ?? 0,
    category: product.category,
    categorySlug: product.categorySlug,
    tags: product.tags.join(", "),
    imageUrls: product.images.join("\n"),
    features: product.features.join("\n"),
    variants: product.variants.map((variant) => `${variant.name}: ${variant.value}`).join("\n"),
    similarProducts: product.similarProductSlugs.join(", "),
    availability: product.availability,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    stockQuantity: product.stockQuantity,
    shippingDetails: product.shippingInfo,
    isFeatured: Boolean(product.isFeatured),
    isNewArrival: Boolean(product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    seoTitle: `${product.name} | AVI FirstBreath Store`,
    metaDescription: product.shortDescription
  };
}

export function calculateCouponDiscount(coupon: DiscountCoupon | undefined, subtotal: number) {
  if (!coupon || !coupon.isActive || subtotal < coupon.minOrderValue) return 0;
  if (coupon.type === "percentage") return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      hero: defaultHeroSettings,
      paymentOptions: defaultPaymentOptions,
      coupons: defaultCoupons,
      saveProduct: (input, existingSlug) => {
        const existing = existingSlug ? get().products.find((product) => product.slug === existingSlug) : undefined;
        const nextProduct = productFromInput(input, existing);
        const products = existingSlug
          ? get().products.map((product) => (product.slug === existingSlug ? nextProduct : product))
          : [nextProduct, ...get().products.filter((product) => product.slug !== nextProduct.slug)];
        set({ products });
        return nextProduct;
      },
      deleteProduct: (slug) => set({ products: get().products.filter((product) => product.slug !== slug) }),
      updateHero: (hero) => set({ hero }),
      savePaymentOption: (option) => {
        const id = option.id || slugify(option.label);
        const nextOption = { ...option, id };
        set({
          paymentOptions: get().paymentOptions.some((item) => item.id === id)
            ? get().paymentOptions.map((item) => (item.id === id ? nextOption : item))
            : [...get().paymentOptions, nextOption]
        });
      },
      deletePaymentOption: (id) => set({ paymentOptions: get().paymentOptions.filter((option) => option.id !== id) }),
      saveCoupon: (coupon) => {
        const code = coupon.code.trim().toUpperCase();
        const id = coupon.id || `coupon-${slugify(code)}`;
        const nextCoupon = { ...coupon, id, code };
        set({
          coupons: get().coupons.some((item) => item.id === id)
            ? get().coupons.map((item) => (item.id === id ? nextCoupon : item))
            : [...get().coupons, nextCoupon]
        });
      },
      deleteCoupon: (id) => set({ coupons: get().coupons.filter((coupon) => coupon.id !== id) }),
      resetStoreSettings: () =>
        set({
          products: seedProducts,
          hero: defaultHeroSettings,
          paymentOptions: defaultPaymentOptions,
          coupons: defaultCoupons
        })
    }),
    {
      name: "avi-firstbreath-admin-store"
    }
  )
);
