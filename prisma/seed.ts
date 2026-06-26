import { PrismaClient } from "@prisma/client";
import { defaultCoupons, defaultHeroSettings, defaultPaymentOptions, defaultStoreSettings } from "../src/lib/defaults";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const categories = [
  ["Breathing Circuits", "breathing-circuits", "Reusable and disposable circuits for neonatal ventilation workflows."],
  ["Neonatal Masks", "neonatal-masks", "Soft neonatal masks for respiratory support and resuscitation."],
  ["CPAP Consumables", "cpap-consumables", "Nasal prongs, masks, and accessories for infant CPAP therapy."],
  ["Oxygen Therapy Consumables", "oxygen-therapy-consumables", "Tubing and disposable oxygen support accessories for NICU use."],
  ["Humidifier Chambers", "humidifier-chambers", "Disposable humidifier chambers and chamber accessories."],
  ["Temperature Probes", "temperature-probes", "Temperature probe covers and related disposable protection."],
  ["Flow Sensors", "flow-sensors", "Neonatal flow sensors and ventilator interface consumables."],
  ["Patient Tubing", "patient-tubing", "Patient tubing, connectors, and sterile line accessories."],
  ["Disposable Kits", "disposable-kits", "Ready-to-use procedure and resuscitation disposable kits."],
  ["Accessories", "accessories", "NICU workflow accessories and compatibility components."]
];

const products = [
  {
    name: "Neonatal Breathing Circuit",
    slug: "neonatal-breathing-circuit",
    sku: "AVI-FB-BC-001",
    categorySlug: "breathing-circuits",
    price: 1250,
    image: "/images/products/neonatal-breathing-circuit.png",
    tags: ["CPAP", "Sterile", "NICU"],
    features: ["Medical-grade material", "Soft neonatal tubing", "Standard connector compatibility", "Ready for clinical workflow"],
    variants: [["Size", "Neonatal"], ["Pack Type", "Single"], ["Compatibility", "Bubble CPAP / ventilator interface"]]
  },
  {
    name: "Infant CPAP Nasal Prongs",
    slug: "infant-cpap-nasal-prongs",
    sku: "AVI-FB-CPAP-002",
    categorySlug: "cpap-consumables",
    price: 650,
    image: "/images/products/infant-cpap-nasal-prongs.png",
    tags: ["Silicone", "CPAP", "Best Seller"],
    features: ["Soft silicone touch", "Infant fit options", "Compatible with CPAP circuits", "Low dead-space design"],
    variants: [["Size", "XS / S / M"], ["Pack Type", "Single"], ["Sterility", "Sterile"]]
  },
  {
    name: "Neonatal CPAP Mask",
    slug: "neonatal-cpap-mask",
    sku: "AVI-FB-MASK-003",
    categorySlug: "neonatal-masks",
    price: 1150,
    image: "/images/products/neonatal-cpap-mask.png",
    tags: ["Soft Cushion", "NICU", "New Arrival"],
    features: ["Soft cushion seal", "Neonatal contour", "Multiple fit options", "Secure respiratory interface"],
    variants: [["Size", "Small / Medium"], ["Pack Type", "Single"], ["Compatibility", "CPAP and oxygen support"]]
  },
  {
    name: "Disposable Humidifier Chamber",
    slug: "disposable-humidifier-chamber",
    sku: "AVI-FB-HUM-004",
    categorySlug: "humidifier-chambers",
    price: 850,
    image: "/images/products/disposable-humidifier-chamber.png",
    tags: ["Disposable", "Humidifier", "Sterile"],
    features: ["Single-patient use", "Clear chamber body", "Fast setup", "Compatible with common humidifier workflows"],
    variants: [["Pack Type", "Single / Box of 10"], ["Sterility", "Sterile"], ["Compatibility", "Heated humidifier systems"]]
  },
  {
    name: "Oxygen Tubing Set",
    slug: "oxygen-tubing-set",
    sku: "AVI-FB-OXY-005",
    categorySlug: "oxygen-therapy-consumables",
    price: 120,
    image: "/images/products/oxygen-tubing-set.png",
    tags: ["Oxygen", "Patient Tubing", "Fast Dispatch"],
    features: ["Flexible tubing", "Standard oxygen connector", "Smooth internal finish", "NICU-friendly length options"],
    variants: [["Length", "1.5m / 2m"], ["Pack Type", "Single / Box"], ["Sterility", "Non-sterile"]]
  },
  {
    name: "Neonatal Flow Sensor",
    slug: "neonatal-flow-sensor",
    sku: "AVI-FB-FLOW-006",
    categorySlug: "flow-sensors",
    price: 2450,
    image: "/images/products/neonatal-flow-sensor.png",
    tags: ["Ventilator", "Flow", "Precision"],
    features: ["Low-resistance design", "Neonatal compatibility", "Reliable flow monitoring", "Disposable use workflow"],
    variants: [["Compatibility", "Select ventilator models"], ["Pack Type", "Single"], ["Sterility", "Sterile"]]
  },
  {
    name: "Temperature Probe Cover",
    slug: "temperature-probe-cover",
    sku: "AVI-FB-TEMP-007",
    categorySlug: "temperature-probes",
    price: 320,
    image: "/images/products/temperature-probe-cover.png",
    tags: ["Temperature", "Cover", "NICU"],
    features: ["Protects reusable probe", "Gentle adhesive options", "Disposable barrier", "Supports infection-control workflow"],
    variants: [["Pack Type", "Pack of 25 / 50"], ["Sterility", "Non-sterile"], ["Compatibility", "Common neonatal probes"]]
  },
  {
    name: "Resuscitation Disposable Kit",
    slug: "resuscitation-disposable-kit",
    sku: "AVI-FB-KIT-008",
    categorySlug: "disposable-kits",
    price: 1950,
    image: "/images/products/neonatal-resuscitation-kit.png",
    tags: ["Emergency", "Kit", "Bulk"],
    features: ["Procedure-ready kit", "Disposable components", "Supports NICU emergency workflow", "Bulk order support"],
    variants: [["Pack Type", "Single kit"], ["Sterility", "Sterile"], ["Configuration", "Customizable on request"]]
  }
];

async function main() {
  const { id: _storeSettingId, ...storeSettingsSeed } = defaultStoreSettings;
  const adminPasswordHash = await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "FirstBreath@123");
  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? "admin@avihealthcare.com" },
    update: { passwordHash: adminPasswordHash, role: "ADMIN" },
    create: {
      name: "AVI FirstBreath Admin",
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@avihealthcare.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN"
    }
  });

  const categoryMap = new Map<string, string>();

  for (const [name, slug, description] of categories) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, description, isActive: true },
      create: { name, slug, description, isActive: true }
    });
    categoryMap.set(slug, category.id);
  }

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        price: product.price,
        tags: product.tags,
        features: product.features,
        categoryId,
        status: "PUBLISHED",
        isFeatured: product.slug !== "temperature-probe-cover",
        isBestSeller: product.tags.includes("Best Seller"),
        isNewArrival: product.tags.includes("New Arrival"),
        stockQuantity: 50
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        shortDescription: `${product.name} for neonatal and NICU workflows.`,
        longDescription:
          "Designed for hospital, clinical, and professional healthcare use. Product compatibility, clinical protocol fit, and availability should be confirmed before purchase or use.",
        price: product.price,
        categoryId,
        tags: product.tags,
        features: product.features,
        shippingDetails: "Dispatch estimate 2-5 working days after order confirmation.",
        stockQuantity: 50,
        isFeatured: product.slug !== "temperature-probe-cover",
        isBestSeller: product.tags.includes("Best Seller"),
        isNewArrival: product.tags.includes("New Arrival"),
        images: {
          create: [
            {
              url: product.image,
              alt: product.name,
              sortOrder: 0
            }
          ]
        },
        variants: {
          create: product.variants.map(([name, value]) => ({
            name,
            value,
            stockQuantity: 25
          }))
        }
      }
    });
  }

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-1" },
    update: {},
    create: {
      id: "seed-testimonial-1",
      quote:
        "AVI Healthcare provides reliable and high-quality neonatal consumables that we trust for our daily NICU care.",
      authorName: "Dr. Ramesh Kumar",
      authorTitle: "Neonatologist",
      hospitalName: "Sunrise Children's Hospital",
      rating: 5
    }
  });

  await prisma.banner.upsert({
    where: { id: "seed-banner-bulk" },
    update: {},
    create: {
      id: "seed-banner-bulk",
      title: "Bulk Purchase? Get Special Pricing",
      subtitle: "We support bulk hospital and institutional orders with specification confirmation.",
      ctaLabel: "Explore Products",
      ctaHref: "/products",
      discountText: "Institutional pricing available"
    }
  });

  await prisma.homepageContent.upsert({
    where: { id: "seed-homepage-content" },
    update: defaultHeroSettings,
    create: { id: "seed-homepage-content", ...defaultHeroSettings }
  });

  for (const option of defaultPaymentOptions) {
    await prisma.paymentOptionSetting.upsert({
      where: { code: option.id },
      update: {
        label: option.label,
        description: option.description,
        isActive: option.isActive,
        bankName: option.bankName,
        accountName: option.accountName,
        accountNumber: option.accountNumber,
        ifsc: option.ifsc,
        branch: option.branch,
        instructions: option.instructions
      },
      create: {
        code: option.id,
        label: option.label,
        description: option.description,
        isActive: option.isActive,
        bankName: option.bankName,
        accountName: option.accountName,
        accountNumber: option.accountNumber,
        ifsc: option.ifsc,
        branch: option.branch,
        instructions: option.instructions
      }
    });
  }

  for (const coupon of defaultCoupons) {
    await prisma.discountCoupon.upsert({
      where: { code: coupon.code },
      update: {
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue,
        isActive: coupon.isActive
      },
      create: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue,
        isActive: coupon.isActive
      }
    });
  }

  await prisma.storeSetting.upsert({
    where: { id: "seed-store-settings" },
    update: storeSettingsSeed,
    create: {
      id: "seed-store-settings",
      ...storeSettingsSeed
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
