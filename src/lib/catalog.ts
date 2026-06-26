import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { bulkBanner, categories as seedCategories, mockOrders, products as seedProducts, testimonials } from "@/lib/data";
import { defaultCoupons, defaultHeroSettings, defaultPaymentOptions, defaultStoreSettings } from "@/lib/defaults";
import type {
  AdminLead,
  AdminCustomer,
  AdminDashboardData,
  AdminInitialData,
  AdminOrder,
  Banner,
  Category,
  CustomerOrder,
  DiscountCoupon,
  HeroSettings,
  PaymentOption,
  Product,
  StoreSettings
} from "@/types";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: true,
  similarProducts: { select: { slug: true } }
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function numberValue(value: unknown) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function splitLines(value: string | undefined) {
  return (value ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mapProduct(product: ProductWithRelations): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category.name,
    categorySlug: product.category.slug,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    price: numberValue(product.price),
    salePrice: product.salePrice ? numberValue(product.salePrice) : undefined,
    images: product.images.length ? product.images.map((image) => image.url) : ["/images/products/neonatal-breathing-circuit.png"],
    tags: product.tags,
    features: product.features,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      priceDelta: numberValue(variant.priceDelta),
      stockQuantity: variant.stockQuantity,
      compatibility: variant.compatibility ?? undefined,
      sterile: variant.sterile
    })),
    stockQuantity: product.stockQuantity,
    availability: product.availability,
    rating: numberValue(product.rating),
    reviewCount: product.reviewCount,
    shippingInfo: product.shippingDetails,
    popularity: product.popularity,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    status: product.status,
    similarProductSlugs: product.similarProducts.map((similar) => similar.slug)
  };
}

function mapOrderStatus(status: string): CustomerOrder["status"] {
  const statusMap: Record<string, CustomerOrder["status"]> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled"
  };
  return statusMap[status] ?? "Pending";
}

function mapPaymentMethod(method: string) {
  const methodMap: Record<string, string> = {
    ONLINE_PENDING: "Online Payment Coming Soon",
    BANK_TRANSFER: "Bank Transfer",
    PURCHASE_ORDER: "Purchase Order / Hospital Procurement"
  };
  return methodMap[method] ?? method;
}

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } }; customer: true };
}>;

export function mapOrder(order: OrderWithItems): AdminOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: mapOrderStatus(order.status),
    paymentMethod: mapPaymentMethod(order.paymentMethod),
    subtotal: numberValue(order.subtotal),
    tax: numberValue(order.tax),
    shipping: numberValue(order.shipping),
    total: numberValue(order.total),
    invoiceUrl: order.invoiceUrl ?? undefined,
    customerName: order.customerName,
    email: order.email ?? "",
    mobile: order.mobile,
    hospitalName: order.hospitalName ?? "",
    gstNumber: order.gstNumber ?? undefined,
    internalNotes: order.internalNotes ?? undefined,
    items: order.items.map((item) => ({
      productSlug: item.product?.slug ?? "",
      productName: item.productName,
      sku: item.sku,
      variant: item.variant ?? undefined,
      quantity: item.quantity,
      unitPrice: numberValue(item.unitPrice),
      total: numberValue(item.total)
    }))
  };
}

export async function getCatalogProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: productInclude,
      orderBy: [{ isFeatured: "desc" }, { popularity: "desc" }, { createdAt: "desc" }]
    });
    return products.map(mapProduct);
  } catch {
    return seedProducts;
  }
}

export async function getCatalogCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
    return categories.map<Category>((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image ?? undefined,
      count: category._count.products,
      isActive: category.isActive,
      sortOrder: category.sortOrder
    }));
  } catch {
    return seedCategories;
  }
}

export async function getProductBySlugFromDb(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: productInclude
    });
    return product ? mapProduct(product) : undefined;
  } catch {
    return seedProducts.find((product) => product.slug === slug);
  }
}

export async function getHomepageContent() {
  try {
    const content = await prisma.homepageContent.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!content) return defaultHeroSettings;
    return {
      eyebrow: content.eyebrow,
      headline: content.headline,
      subheadline: content.subheadline,
      primaryCtaLabel: content.primaryCtaLabel,
      primaryCtaHref: content.primaryCtaHref,
      secondaryCtaLabel: content.secondaryCtaLabel,
      secondaryCtaHref: content.secondaryCtaHref,
      image: content.image,
      imageAlt: content.imageAlt,
      calloutTitle: content.calloutTitle,
      calloutText: content.calloutText
    } satisfies HeroSettings;
  } catch {
    return defaultHeroSettings;
  }
}

export async function getBulkBanner() {
  try {
    const banner = await prisma.banner.findFirst({
      where: { position: "HOME_BULK", isActive: true },
      orderBy: { updatedAt: "desc" }
    });
    if (!banner) return bulkBanner;
    return {
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      ctaLabel: banner.ctaLabel ?? "Explore Products",
      ctaHref: banner.ctaHref ?? "/products",
      discountText: banner.discountText ?? undefined
    } satisfies Banner;
  } catch {
    return bulkBanner;
  }
}

export async function getTestimonials() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6
    });
    return rows.length
      ? rows.map((testimonial) => ({
          quote: testimonial.quote,
          authorName: testimonial.authorName,
          authorTitle: testimonial.authorTitle,
          hospitalName: testimonial.hospitalName ?? undefined,
          rating: testimonial.rating
        }))
      : testimonials;
  } catch {
    return testimonials;
  }
}

export async function getPaymentOptions() {
  try {
    const rows = await prisma.paymentOptionSetting.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
    });
    return rows.length
      ? rows.map<PaymentOption>((option) => ({
          id: option.code,
          label: option.label,
          description: option.description,
          isActive: option.isActive,
          bankName: option.bankName ?? undefined,
          accountName: option.accountName ?? undefined,
          accountNumber: option.accountNumber ?? undefined,
          ifsc: option.ifsc ?? undefined,
          branch: option.branch ?? undefined,
          instructions: option.instructions ?? undefined
        }))
      : defaultPaymentOptions;
  } catch {
    return defaultPaymentOptions;
  }
}

export async function getDiscountCoupons() {
  try {
    const rows = await prisma.discountCoupon.findMany({ orderBy: { createdAt: "desc" } });
    return rows.length
      ? rows.map<DiscountCoupon>((coupon) => ({
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          type: coupon.type === "fixed" ? "fixed" : "percentage",
          value: numberValue(coupon.value),
          minOrderValue: numberValue(coupon.minOrderValue),
          isActive: coupon.isActive
        }))
      : defaultCoupons;
  } catch {
    return defaultCoupons;
  }
}

export async function getStoreSettings() {
  try {
    const settings = await prisma.storeSetting.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!settings) return defaultStoreSettings;
    return {
      id: settings.id,
      companyName: settings.companyName,
      companyAddress: settings.companyAddress,
      contactEmail: settings.contactEmail,
      phoneNumber: settings.phoneNumber,
      whatsappNumber: settings.whatsappNumber ?? "",
      gstNumber: settings.gstNumber ?? "",
      footerText: settings.footerText,
      privacyPolicy: settings.privacyPolicy,
      termsAndConditions: settings.termsAndConditions,
      shippingPolicy: settings.shippingPolicy,
      returnPolicy: settings.returnPolicy
    } satisfies StoreSettings;
  } catch {
    return defaultStoreSettings;
  }
}

export function mapLeadStatus(status: string): AdminLead["status"] {
  const statusMap: Record<string, AdminLead["status"]> = {
    NEW_QUOTE_REQUEST: "NEW_QUOTE_REQUEST",
    WHATSAPP_ENQUIRY: "WHATSAPP_ENQUIRY",
    CONTACTED: "CONTACTED",
    QUALIFIED: "QUALIFIED",
    CONVERTED: "CONVERTED",
    CLOSED: "CLOSED"
  };
  return statusMap[status] ?? "NEW_QUOTE_REQUEST";
}

export function mapLeadType(type: string): AdminLead["type"] {
  return type === "WHATSAPP_ENQUIRY" ? "WHATSAPP_ENQUIRY" : "BULK_QUOTE";
}

export function mapLead(lead: {
  id: string;
  leadNumber: string;
  type: string;
  status: string;
  productName: string;
  variant: string | null;
  name: string;
  mobile: string;
  email: string | null;
  companyName: string | null;
  cityState: string | null;
  estimatedQuantity: number | null;
  purchaseType: string | null;
  expectedTimeline: string | null;
  additionalRequirements: string | null;
  fileName: string | null;
  whatsappMessage: string | null;
  notificationStatus: string;
  createdAt: Date;
}): AdminLead {
  return {
    id: lead.id,
    leadNumber: lead.leadNumber,
    type: mapLeadType(lead.type),
    status: mapLeadStatus(lead.status),
    productName: lead.productName,
    variant: lead.variant ?? undefined,
    name: lead.name,
    mobile: lead.mobile,
    email: lead.email ?? undefined,
    companyName: lead.companyName ?? undefined,
    cityState: lead.cityState ?? undefined,
    estimatedQuantity: lead.estimatedQuantity ?? undefined,
    purchaseType: lead.purchaseType ?? undefined,
    expectedTimeline: lead.expectedTimeline ?? undefined,
    additionalRequirements: lead.additionalRequirements ?? undefined,
    fileName: lead.fileName ?? undefined,
    whatsappMessage: lead.whatsappMessage ?? undefined,
    notificationStatus: lead.notificationStatus,
    createdAt: lead.createdAt.toISOString()
  };
}

export async function getAdminLeads() {
  try {
    const leads = await prisma.$queryRawUnsafe<
      {
        id: string;
        leadNumber: string;
        type: string;
        status: string;
        productName: string;
        variant: string | null;
        name: string;
        mobile: string;
        email: string | null;
        companyName: string | null;
        cityState: string | null;
        estimatedQuantity: number | null;
        purchaseType: string | null;
        expectedTimeline: string | null;
        additionalRequirements: string | null;
        fileName: string | null;
        whatsappMessage: string | null;
        notificationStatus: string;
        createdAt: Date;
      }[]
    >(
      `SELECT "id", "leadNumber", "type"::text AS "type", "status"::text AS "status", "productName", "variant", "name", "mobile", "email", "companyName", "cityState", "estimatedQuantity", "purchaseType", "expectedTimeline", "additionalRequirements", "fileName", "whatsappMessage", "notificationStatus", "createdAt"
       FROM "Lead"
       ORDER BY "createdAt" DESC
       LIMIT 200`
    );
    return leads.map(mapLead);
  } catch {
    return [];
  }
}

export async function getAdminInitialData(): Promise<AdminInitialData> {
  const [products, categories, orders, customers, leads, hero, paymentOptions, coupons, storeSettings] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
    getAdminOrders(),
    getAdminCustomers(),
    getAdminLeads(),
    getHomepageContent(),
    getPaymentOptions(),
    getDiscountCoupons(),
    getStoreSettings()
  ]);
  const lowStock = products.filter((product) => product.stockQuantity <= 25);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const dashboard: AdminDashboardData = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingEnquiries: orders.filter((order) => order.status === "Pending").length + leads.filter((lead) => lead.status === "NEW_QUOTE_REQUEST").length,
    totalLeads: leads.length,
    revenue,
    lowStock,
    recentOrders: orders.slice(0, 5)
  };

  return { products, categories, customers, orders, leads, hero, paymentOptions, coupons, storeSettings, dashboard };
}

export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, customer: true },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return orders.map(mapOrder);
  } catch {
    return mockOrders.map((order) => ({
      ...order,
      customerName: "Dr. Ramesh Kumar",
      email: "orders@hospital.example",
      mobile: "9876543210",
      hospitalName: "Sunrise Children's Hospital"
    })) satisfies AdminOrder[];
  }
}

export async function getAdminCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: { select: { addresses: true, orders: true } },
        orders: { select: { total: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 200
    });
    return customers.map<AdminCustomer>((customer) => ({
      id: customer.id,
      fullName: customer.fullName ?? "Customer",
      email: customer.email ?? "",
      mobile: customer.mobile ?? "",
      hospitalName: customer.hospitalName ?? "",
      gstNumber: customer.gstNumber ?? "",
      addressCount: customer._count.addresses,
      orderCount: customer._count.orders,
      totalSpend: customer.orders.reduce((sum, order) => sum + numberValue(order.total), 0),
      createdAt: customer.createdAt.toISOString()
    }));
  } catch {
    return [];
  }
}
