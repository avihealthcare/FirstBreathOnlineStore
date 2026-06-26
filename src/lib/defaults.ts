import type { DiscountCoupon, HeroSettings, PaymentOption, StoreSettings } from "@/types";

export const defaultHeroSettings: HeroSettings = {
  eyebrow: "AVI Healthcare Pvt Ltd",
  headline: "Trusted Neonatal Consumables for NICUs and Hospitals",
  subheadline:
    "High-quality disposable and consumable products for neonatal respiratory care, CPAP therapy, oxygen support, and NICU workflows.",
  primaryCtaLabel: "Shop Products",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "View Catalogue",
  secondaryCtaHref: "/products",
  image: "/images/hero-nicu.png",
  imageAlt: "Newborn receiving neonatal respiratory support",
  calloutTitle: "NICU-ready procurement",
  calloutText: "Direct orders, purchase enquiries, GST details, and hospital procurement workflows in one store."
};

export const defaultPaymentOptions: PaymentOption[] = [
  {
    id: "online",
    label: "Online Payment Coming Soon",
    description: "Razorpay placeholder for future integration.",
    isActive: true,
    instructions: "Enable Razorpay after API keys are added."
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Share bank transfer confirmation after order review.",
    isActive: true,
    bankName: "HDFC Bank",
    accountName: "AVI Healthcare Pvt Ltd",
    accountNumber: "000000000000",
    ifsc: "HDFC0000000",
    branch: "Hyderabad",
    instructions: "Use order number as payment reference."
  },
  {
    id: "purchase-order",
    label: "Purchase Order / Hospital Procurement",
    description: "Recommended for hospitals and institutional buying.",
    isActive: true,
    instructions: "Upload or share PO after order review."
  }
];

export const defaultCoupons: DiscountCoupon[] = [
  {
    id: "coupon-firstbreath5",
    code: "FIRSTBREATH5",
    description: "5% launch discount on qualifying NICU consumables.",
    type: "percentage",
    value: 5,
    minOrderValue: 1000,
    isActive: true
  },
  {
    id: "coupon-nicu500",
    code: "NICU500",
    description: "Flat Rs. 500 discount on bulk orders above Rs. 5,000.",
    type: "fixed",
    value: 500,
    minOrderValue: 5000,
    isActive: true
  }
];

export const defaultStoreSettings: StoreSettings = {
  id: "seed-store-settings",
  companyName: "AVI Healthcare Pvt Ltd",
  companyAddress: "AVI Healthcare Pvt Ltd, India",
  contactEmail: "sales@avihealthcare.com",
  phoneNumber: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  gstNumber: "GST placeholder",
  footerText: "For hospital, clinical, and professional healthcare use.",
  privacyPolicy: "Customer and order data should be handled according to privacy and data protection best practices.",
  termsAndConditions: "Product specifications, compatibility, and availability should be confirmed before purchase.",
  shippingPolicy: "Dispatch timelines depend on stock status and order confirmation.",
  returnPolicy: "Returns are subject to product condition, batch, and procurement terms."
};
