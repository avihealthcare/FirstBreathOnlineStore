import type { Banner, Category, CustomerOrder, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-breathing",
    name: "Breathing Circuits",
    slug: "breathing-circuits",
    description: "Disposable circuits and connectors for neonatal respiratory support.",
    image: "/images/products/neonatal-breathing-circuit.png",
    count: 12
  },
  {
    id: "cat-masks",
    name: "Neonatal Masks",
    slug: "neonatal-masks",
    description: "Soft-fit masks for CPAP, oxygen support, and resuscitation workflows.",
    image: "/images/products/neonatal-cpap-mask.png",
    count: 9
  },
  {
    id: "cat-cpap",
    name: "CPAP Consumables",
    slug: "cpap-consumables",
    description: "Nasal prongs, masks, and patient interface consumables.",
    image: "/images/products/infant-cpap-nasal-prongs.png",
    count: 16
  },
  {
    id: "cat-oxygen",
    name: "Oxygen Therapy Consumables",
    slug: "oxygen-therapy-consumables",
    description: "Tubing sets and oxygen delivery accessories for hospitals.",
    image: "/images/products/oxygen-tubing-set.png",
    count: 8
  },
  {
    id: "cat-humidifier",
    name: "Humidifier Chambers",
    slug: "humidifier-chambers",
    description: "Disposable chambers and humidification workflow accessories.",
    image: "/images/products/disposable-humidifier-chamber.png",
    count: 5
  },
  {
    id: "cat-temp",
    name: "Temperature Probes",
    slug: "temperature-probes",
    description: "Probe covers and related neonatal temperature monitoring disposables.",
    image: "/images/products/temperature-probe-cover.png",
    count: 6
  },
  {
    id: "cat-flow",
    name: "Flow Sensors",
    slug: "flow-sensors",
    description: "Flow monitoring consumables for compatible ventilator systems.",
    image: "/images/products/neonatal-flow-sensor.png",
    count: 4
  },
  {
    id: "cat-tubing",
    name: "Patient Tubing",
    slug: "patient-tubing",
    description: "Patient tubing, adapters, and sterile connector options.",
    image: "/images/products/oxygen-tubing-set.png",
    count: 10
  },
  {
    id: "cat-kits",
    name: "Disposable Kits",
    slug: "disposable-kits",
    description: "Ready-to-use disposable sets for NICU and pediatric departments.",
    image: "/images/products/neonatal-resuscitation-kit.png",
    count: 7
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Clinical support accessories for repeat hospital workflows.",
    image: "/images/products/temperature-probe-cover.png",
    count: 18
  }
];

export const products: Product[] = [
  {
    id: "prod-bc-001",
    name: "Neonatal Breathing Circuit",
    slug: "neonatal-breathing-circuit",
    sku: "AVI-FB-BC-001",
    category: "Breathing Circuits",
    categorySlug: "breathing-circuits",
    shortDescription: "Medical-grade neonatal breathing circuit with water trap and soft tubing.",
    longDescription:
      "A hospital-focused neonatal breathing circuit designed for respiratory support workflows in NICUs and pediatric departments. It supports CPAP and ventilation setup requirements where compatibility is confirmed by the clinical or biomedical team.",
    price: 1250,
    images: [
      "/images/products/neonatal-breathing-circuit.png",
      "/images/products/neonatal-breathing-circuit.png",
      "/images/products/oxygen-tubing-set.png"
    ],
    tags: ["CPAP", "Sterile", "NICU"],
    features: [
      "Medical-grade patient contact material",
      "Soft neonatal tubing with water trap option",
      "Standard connector compatibility",
      "Designed for fast hospital setup"
    ],
    variants: [
      { id: "bc-size-n", name: "Size", value: "Neonatal", stockQuantity: 38, sterile: true },
      { id: "bc-pack-single", name: "Pack Type", value: "Single pack", stockQuantity: 38, sterile: true },
      { id: "bc-compat", name: "Compatibility", value: "CPAP / ventilator interface", stockQuantity: 20, sterile: true }
    ],
    stockQuantity: 38,
    availability: "In stock",
    rating: 4.8,
    reviewCount: 24,
    shippingInfo: "Pan India delivery. Dispatch estimate 2-5 working days after confirmation.",
    popularity: 95,
    isFeatured: true,
    isBestSeller: true,
    similarProductSlugs: ["infant-cpap-nasal-prongs", "neonatal-cpap-mask", "disposable-humidifier-chamber"]
  },
  {
    id: "prod-cpap-002",
    name: "Infant CPAP Nasal Prongs",
    slug: "infant-cpap-nasal-prongs",
    sku: "AVI-FB-CPAP-002",
    category: "CPAP Consumables",
    categorySlug: "cpap-consumables",
    shortDescription: "Soft silicone nasal prongs for infant CPAP therapy and neonatal respiratory care.",
    longDescription:
      "Infant CPAP nasal prongs built for NICU respiratory support and comfortable patient interface management. Available in practical size options for hospital ordering.",
    price: 650,
    images: [
      "/images/products/infant-cpap-nasal-prongs.png",
      "/images/products/neonatal-cpap-mask.png",
      "/images/products/neonatal-breathing-circuit.png"
    ],
    tags: ["CPAP", "Silicone", "Best Seller"],
    features: ["Soft silicone touch", "Multiple size options", "Low dead-space design", "Compatible with CPAP circuits"],
    variants: [
      { id: "prongs-xs", name: "Size", value: "XS", stockQuantity: 30, sterile: true },
      { id: "prongs-s", name: "Size", value: "Small", stockQuantity: 42, sterile: true },
      { id: "prongs-m", name: "Size", value: "Medium", stockQuantity: 26, sterile: true }
    ],
    stockQuantity: 42,
    availability: "In stock",
    rating: 4.7,
    reviewCount: 18,
    shippingInfo: "Bulk cartons available on request. Dispatch estimate 2-4 working days.",
    popularity: 88,
    isFeatured: true,
    isBestSeller: true,
    similarProductSlugs: ["neonatal-cpap-mask", "neonatal-breathing-circuit", "oxygen-tubing-set"]
  },
  {
    id: "prod-mask-003",
    name: "Neonatal CPAP Mask",
    slug: "neonatal-cpap-mask",
    sku: "AVI-FB-MASK-003",
    category: "Neonatal Masks",
    categorySlug: "neonatal-masks",
    shortDescription: "Soft cushion neonatal CPAP mask for a secure respiratory interface.",
    longDescription:
      "A soft neonatal CPAP mask designed for clinical respiratory care workflows. The cushion profile supports gentle fitting when used with compatible CPAP systems and clinical protocols.",
    price: 1150,
    salePrice: 1050,
    images: [
      "/images/products/neonatal-cpap-mask.png",
      "/images/products/infant-cpap-nasal-prongs.png",
      "/images/products/neonatal-breathing-circuit.png"
    ],
    tags: ["Soft Cushion", "NICU", "New Arrival"],
    features: ["Soft cushion seal", "Neonatal contour", "Secure interface", "Hospital procurement support"],
    variants: [
      { id: "mask-s", name: "Size", value: "Small", stockQuantity: 20, sterile: true },
      { id: "mask-m", name: "Size", value: "Medium", stockQuantity: 18, sterile: true }
    ],
    stockQuantity: 20,
    availability: "In stock",
    rating: 4.6,
    reviewCount: 21,
    shippingInfo: "Dispatch estimate 3-5 working days after confirmation.",
    popularity: 82,
    isFeatured: true,
    isNewArrival: true,
    similarProductSlugs: ["infant-cpap-nasal-prongs", "neonatal-breathing-circuit", "resuscitation-disposable-kit"]
  },
  {
    id: "prod-hum-004",
    name: "Disposable Humidifier Chamber",
    slug: "disposable-humidifier-chamber",
    sku: "AVI-FB-HUM-004",
    category: "Humidifier Chambers",
    categorySlug: "humidifier-chambers",
    shortDescription: "Single-patient humidifier chamber for respiratory support systems.",
    longDescription:
      "Disposable humidifier chamber for hospital respiratory care setups. Designed for efficient replacement and procurement-friendly bulk ordering.",
    price: 850,
    images: [
      "/images/products/disposable-humidifier-chamber.png",
      "/images/products/neonatal-breathing-circuit.png",
      "/images/products/oxygen-tubing-set.png"
    ],
    tags: ["Disposable", "Humidifier", "Sterile"],
    features: ["Clear chamber body", "Single-patient workflow", "Fast installation", "Bulk order packs available"],
    variants: [
      { id: "hum-single", name: "Pack Type", value: "Single", stockQuantity: 46, sterile: true },
      { id: "hum-box", name: "Pack Type", value: "Box of 10", stockQuantity: 12, sterile: true }
    ],
    stockQuantity: 46,
    availability: "In stock",
    rating: 4.5,
    reviewCount: 12,
    shippingInfo: "Dispatch estimate 2-5 working days. Box quantities can be quoted separately.",
    popularity: 74,
    isFeatured: true,
    similarProductSlugs: ["neonatal-breathing-circuit", "oxygen-tubing-set", "neonatal-flow-sensor"]
  },
  {
    id: "prod-oxy-005",
    name: "Oxygen Tubing Set",
    slug: "oxygen-tubing-set",
    sku: "AVI-FB-OXY-005",
    category: "Oxygen Therapy Consumables",
    categorySlug: "oxygen-therapy-consumables",
    shortDescription: "Flexible oxygen tubing set with standard connectors for hospital use.",
    longDescription:
      "A dependable oxygen tubing set for NICU, pediatric, and hospital oxygen support workflows. Suitable for institutional ordering where specifications are verified before use.",
    price: 120,
    images: [
      "/images/products/oxygen-tubing-set.png",
      "/images/products/neonatal-breathing-circuit.png",
      "/images/products/temperature-probe-cover.png"
    ],
    tags: ["Oxygen", "Patient Tubing", "Fast Dispatch"],
    features: ["Flexible tubing", "Standard connector", "Smooth internal finish", "Multiple length options"],
    variants: [
      { id: "oxy-15", name: "Length", value: "1.5m", stockQuantity: 120, sterile: false },
      { id: "oxy-20", name: "Length", value: "2m", stockQuantity: 84, sterile: false }
    ],
    stockQuantity: 120,
    availability: "In stock",
    rating: 4.4,
    reviewCount: 8,
    shippingInfo: "Fast dispatch item. Bulk cartons available for distributors.",
    popularity: 68,
    similarProductSlugs: ["neonatal-breathing-circuit", "disposable-humidifier-chamber", "temperature-probe-cover"]
  },
  {
    id: "prod-flow-006",
    name: "Neonatal Flow Sensor",
    slug: "neonatal-flow-sensor",
    sku: "AVI-FB-FLOW-006",
    category: "Flow Sensors",
    categorySlug: "flow-sensors",
    shortDescription: "Low-resistance neonatal flow sensor for compatible respiratory systems.",
    longDescription:
      "A neonatal flow sensor intended for professional healthcare environments. Biomedical teams should confirm compatibility with the target device before order confirmation.",
    price: 2450,
    images: [
      "/images/products/neonatal-flow-sensor.png",
      "/images/products/neonatal-breathing-circuit.png",
      "/images/products/infant-cpap-nasal-prongs.png"
    ],
    tags: ["Ventilator", "Flow", "Precision"],
    features: ["Low resistance", "Neonatal compatibility", "Disposable workflow", "Biomedical verification recommended"],
    variants: [
      { id: "flow-single", name: "Pack Type", value: "Single", stockQuantity: 16, sterile: true },
      { id: "flow-model", name: "Compatibility", value: "Select ventilator models", stockQuantity: 16, sterile: true }
    ],
    stockQuantity: 16,
    availability: "Limited stock",
    rating: 4.7,
    reviewCount: 14,
    shippingInfo: "Compatibility confirmation recommended before dispatch.",
    popularity: 64,
    similarProductSlugs: ["neonatal-breathing-circuit", "disposable-humidifier-chamber", "infant-cpap-nasal-prongs"]
  },
  {
    id: "prod-temp-007",
    name: "Temperature Probe Cover",
    slug: "temperature-probe-cover",
    sku: "AVI-FB-TEMP-007",
    category: "Temperature Probes",
    categorySlug: "temperature-probes",
    shortDescription: "Disposable cover for neonatal temperature probe protection.",
    longDescription:
      "Probe covers support hygiene and infection-control workflows when used with compatible neonatal temperature probes and clinical protocols.",
    price: 320,
    images: [
      "/images/products/temperature-probe-cover.png",
      "/images/products/oxygen-tubing-set.png",
      "/images/products/neonatal-flow-sensor.png"
    ],
    tags: ["Temperature", "Cover", "NICU"],
    features: ["Disposable barrier", "Gentle adhesive option", "Common probe compatibility", "Pack-size ordering"],
    variants: [
      { id: "temp-25", name: "Pack Type", value: "Pack of 25", stockQuantity: 60, sterile: false },
      { id: "temp-50", name: "Pack Type", value: "Pack of 50", stockQuantity: 44, sterile: false }
    ],
    stockQuantity: 60,
    availability: "In stock",
    rating: 4.3,
    reviewCount: 7,
    shippingInfo: "Dispatch estimate 2-4 working days.",
    popularity: 52,
    similarProductSlugs: ["oxygen-tubing-set", "neonatal-flow-sensor", "resuscitation-disposable-kit"]
  },
  {
    id: "prod-kit-008",
    name: "Resuscitation Disposable Kit",
    slug: "resuscitation-disposable-kit",
    sku: "AVI-FB-KIT-008",
    category: "Disposable Kits",
    categorySlug: "disposable-kits",
    shortDescription: "Disposable kit for neonatal resuscitation workflow readiness.",
    longDescription:
      "A practical disposable kit for NICU and pediatric resuscitation workflows. Contents can be aligned with institutional procurement requirements after confirmation.",
    price: 1950,
    images: [
      "/images/products/neonatal-resuscitation-kit.png",
      "/images/products/neonatal-cpap-mask.png",
      "/images/products/infant-cpap-nasal-prongs.png"
    ],
    tags: ["Emergency", "Kit", "Bulk"],
    features: ["Procedure-ready components", "Custom bulk quote support", "Disposable workflow", "Hospital procurement friendly"],
    variants: [
      { id: "kit-standard", name: "Configuration", value: "Standard kit", stockQuantity: 22, sterile: true },
      { id: "kit-custom", name: "Configuration", value: "Custom on request", stockQuantity: 10, sterile: true }
    ],
    stockQuantity: 22,
    availability: "In stock",
    rating: 4.8,
    reviewCount: 19,
    shippingInfo: "Bulk kit orders may require specification confirmation.",
    popularity: 72,
    isFeatured: true,
    similarProductSlugs: ["neonatal-cpap-mask", "neonatal-breathing-circuit", "infant-cpap-nasal-prongs"]
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "AVI Healthcare provides reliable and high-quality neonatal consumables that we trust for our daily NICU care.",
    authorName: "Dr. Ramesh Kumar",
    authorTitle: "Neonatologist",
    hospitalName: "Sunrise Children's Hospital",
    rating: 5
  },
  {
    quote:
      "The buying flow is built around hospital realities: specifications, GST details, and bulk-order confirmation.",
    authorName: "Meera N.",
    authorTitle: "Purchase Manager",
    hospitalName: "City Children's Centre",
    rating: 5
  }
];

export const bulkBanner: Banner = {
  title: "Bulk Purchase? Get Special Pricing",
  subtitle: "We support bulk hospital and institutional orders with specification and availability confirmation.",
  ctaLabel: "Explore Products",
  ctaHref: "/products",
  discountText: "Institutional pricing available"
};

export const mockOrders: CustomerOrder[] = [
  {
    id: "order-001",
    orderNumber: "AVI-ORD-2024-000123",
    createdAt: "2026-06-10",
    status: "Confirmed",
    paymentMethod: "Purchase Order / Hospital Procurement",
    subtotal: 4300,
    tax: 215,
    shipping: 100,
    total: 4615,
    items: [
      {
        productSlug: "neonatal-breathing-circuit",
        productName: "Neonatal Breathing Circuit",
        sku: "AVI-FB-BC-001",
        variant: "Neonatal",
        quantity: 2,
        unitPrice: 1250,
        total: 2500
      },
      {
        productSlug: "disposable-humidifier-chamber",
        productName: "Disposable Humidifier Chamber",
        sku: "AVI-FB-HUM-004",
        variant: "Single",
        quantity: 2,
        unitPrice: 850,
        total: 1700
      }
    ],
    invoiceUrl: "#"
  }
];

export const trustNotes = [
  "For hospital, clinical, and professional healthcare use.",
  "Please verify product compatibility before use.",
  "Bulk institutional orders may require confirmation of specifications and availability.",
  "Product images are representative and may vary by batch or supplier.",
  "This website does not provide medical advice.",
  "Use products only as per applicable clinical protocols and manufacturer instructions.",
  "Customer and order data should be handled according to privacy and data protection best practices."
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getSimilarProducts(slugs: string[]) {
  return slugs.map((slug) => getProductBySlug(slug)).filter(Boolean) as Product[];
}

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured).slice(0, 4);
}
