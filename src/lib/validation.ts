import { z } from "zod";
import { isIndianMobile } from "@/lib/utils";

export const mobileSchema = z
  .string()
  .min(10, "Enter a valid 10-digit mobile number")
  .refine(isIndianMobile, "Enter a valid Indian mobile number");

export const otpRequestSchema = z.object({
  mobile: mobileSchema
});

export const otpVerifySchema = z.object({
  mobile: mobileSchema,
  otp: z.string().length(6, "Enter the 6-digit OTP")
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: mobileSchema,
  hospitalName: z.string().min(2, "Hospital/company name is required"),
  gstNumber: z.string().optional(),
  addressLine1: z.string().min(4, "Shipping address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country: z.string().min(2, "Country is required"),
  purchaseType: z.string().min(1),
  paymentMethod: z.string().min(1, "Select a payment method")
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const adminProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().min(2),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().optional(),
  category: z.string().min(2),
  categorySlug: z.string().optional(),
  tags: z.string().min(2),
  imageUrls: z.string().min(1, "Add at least one product picture"),
  features: z.string().min(5),
  variants: z.string().min(3),
  similarProducts: z.string().optional(),
  availability: z.string().min(2),
  shortDescription: z.string().min(10),
  longDescription: z.string().min(20),
  stockQuantity: z.coerce.number().int().nonnegative(),
  shippingDetails: z.string().min(5),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  seoTitle: z.string().min(5),
  metaDescription: z.string().min(10)
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
