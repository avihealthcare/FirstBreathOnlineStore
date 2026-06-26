export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  priceDelta?: number;
  stockQuantity?: number;
  compatibility?: string;
  sterile?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  count: number;
  isActive?: boolean;
  sortOrder?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  images: string[];
  tags: string[];
  features: string[];
  variants: ProductVariant[];
  stockQuantity: number;
  availability: string;
  rating: number;
  reviewCount: number;
  shippingInfo: string;
  popularity: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  similarProductSlugs: string[];
};

export type CartLine = {
  id: string;
  productSlug: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  variant?: string;
  quantity: number;
};

export type Address = {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
};

export type CustomerProfile = {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  hospitalName: string;
  gstNumber: string;
  billingAddress?: string;
  addresses: Address[];
  savedProductSlugs: string[];
  recentlyPurchasedSlugs: string[];
};

export type OrderItem = {
  productSlug: string;
  productName: string;
  sku: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  items: OrderItem[];
  invoiceUrl?: string;
};

export type Testimonial = {
  quote: string;
  authorName: string;
  authorTitle: string;
  hospitalName?: string;
  rating: number;
};

export type Banner = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  discountText?: string;
};

export type HeroSettings = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  imageAlt: string;
  calloutTitle: string;
  calloutText: string;
};

export type PaymentOption = {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  instructions?: string;
};

export type DiscountCoupon = {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  isActive: boolean;
};

export type AdminCustomer = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  hospitalName: string;
  gstNumber: string;
  addressCount: number;
  orderCount: number;
  totalSpend: number;
  createdAt: string;
};

export type AdminOrder = CustomerOrder & {
  customerName: string;
  email: string;
  mobile: string;
  hospitalName: string;
  gstNumber?: string;
  internalNotes?: string;
};

export type AdminDashboardData = {
  totalProducts: number;
  totalOrders: number;
  pendingEnquiries: number;
  revenue: number;
  lowStock: Product[];
  recentOrders: AdminOrder[];
};

export type AdminInitialData = {
  products: Product[];
  categories: Category[];
  customers: AdminCustomer[];
  orders: AdminOrder[];
  hero: HeroSettings;
  paymentOptions: PaymentOption[];
  coupons: DiscountCoupon[];
  dashboard: AdminDashboardData;
};
