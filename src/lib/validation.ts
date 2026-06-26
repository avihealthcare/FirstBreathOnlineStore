import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
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

export const customerLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const customerSignupSchema = customerLoginSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
  hospitalName: z.string().min(2, "Hospital/company name is required"),
  mobile: z.string().optional(),
  gstNumber: z.string().optional()
});

const indianMobileSchema = z
  .string()
  .trim()
  .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number");

export const bulkQuoteSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(2, "Product name is required"),
  variant: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  mobile: indianMobileSchema,
  email: z.string().email("Enter a valid email"),
  companyName: z.string().min(2, "Company/hospital name is required"),
  cityState: z.string().optional(),
  estimatedQuantity: z.coerce.number().int().positive("Estimated quantity is required"),
  purchaseType: z.string().min(2, "Purchase type is required"),
  expectedTimeline: z.string().optional(),
  additionalRequirements: z.string().optional(),
  fileName: z.string().optional()
});

export const whatsappEnquirySchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(2, "Product name is required"),
  variant: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  mobile: indianMobileSchema,
  companyName: z.string().optional(),
  quantity: z.coerce.number().int().positive("Quantity is required")
});

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(8, "Enter the admin password")
});

export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;
export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type BulkQuoteInput = z.infer<typeof bulkQuoteSchema>;
export type WhatsappEnquiryInput = z.infer<typeof whatsappEnquirySchema>;

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

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().min(5, "Category description is required"),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0)
});

export const customerProfileSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().optional(),
  hospitalName: z.string().optional(),
  gstNumber: z.string().optional()
});

export const storeSettingsSchema = z.object({
  companyName: z.string().min(2),
  companyAddress: z.string().min(5),
  contactEmail: z.string().email(),
  phoneNumber: z.string().min(8),
  whatsappNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  footerText: z.string().min(5),
  privacyPolicy: z.string().min(10),
  termsAndConditions: z.string().min(10),
  shippingPolicy: z.string().min(10),
  returnPolicy: z.string().min(10)
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type CustomerProfileInput = z.infer<typeof customerProfileSchema>;
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
