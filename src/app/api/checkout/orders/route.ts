import { NextResponse } from "next/server";
import type { PaymentMethod } from "@prisma/client";
import { getCurrentCustomerId, mapCustomerProfile } from "@/lib/customer-auth";
import { mapOrder } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { buildOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validation";
import type { CartLine } from "@/types";

export const runtime = "nodejs";

type CheckoutPayload = {
  customer?: unknown;
  items?: CartLine[];
  couponCode?: string;
};

function paymentMethodFromId(value: string): PaymentMethod {
  if (value === "online") return "ONLINE_PENDING";
  if (value === "bank" || value === "bank-transfer") return "BANK_TRANSFER";
  return "PURCHASE_ORDER";
}

function couponDiscount(type: string, value: number, subtotal: number) {
  if (type === "fixed") return Math.min(value, subtotal);
  return Math.round((subtotal * value) / 100);
}

export async function POST(request: Request) {
  const customerId = await getCurrentCustomerId();
  if (!customerId) {
    return NextResponse.json({ ok: false, error: "Please login with email before checkout." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const parsedCustomer = checkoutSchema.safeParse(body?.customer);
  const items = body?.items ?? [];

  if (!parsedCustomer.success) {
    return NextResponse.json({ ok: false, error: parsedCustomer.error.errors[0]?.message ?? "Invalid customer details." }, { status: 400 });
  }

  if (!items.length) {
    return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  }

  const productSlugs = Array.from(new Set(items.map((item) => item.productSlug)));
  const products = await prisma.product.findMany({
    where: { slug: { in: productSlugs }, status: "PUBLISHED" },
    include: { category: true, images: true, variants: true, similarProducts: true }
  });
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  const orderLines = items.map((item) => {
    const product = productBySlug.get(item.productSlug);
    if (!product) throw new Error(`${item.name} is no longer available.`);
    const unitPrice = Number(product.salePrice ?? product.price);
    const quantity = Math.max(1, Number(item.quantity));
    return {
      product,
      quantity,
      variant: item.variant,
      unitPrice,
      total: unitPrice * quantity
    };
  });

  const subtotal = orderLines.reduce((sum, item) => sum + item.total, 0);
  const coupon = body?.couponCode
    ? await prisma.discountCoupon.findUnique({ where: { code: body.couponCode.trim().toUpperCase() } })
    : null;
  const discountAmount =
    coupon?.isActive && subtotal >= Number(coupon.minOrderValue)
      ? couponDiscount(coupon.type, Number(coupon.value), subtotal)
      : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableSubtotal * 0.05);
  const shipping = subtotal >= 5000 ? 0 : 100;
  const total = taxableSubtotal + tax + shipping;
  const customerInput = parsedCustomer.data;

  try {
    const created = await prisma.$transaction(async (tx) => {
      await tx.customer.update({
        where: { id: customerId },
        data: {
          fullName: customerInput.fullName,
          email: customerInput.email.trim().toLowerCase(),
          mobile: customerInput.mobile,
          hospitalName: customerInput.hospitalName,
          gstNumber: customerInput.gstNumber || null,
          billingAddress: `${customerInput.addressLine1}, ${customerInput.city}`,
          recentlyPurchasedSlugs: Array.from(new Set(orderLines.map((line) => line.product.slug)))
        }
      });

      const existingDefaultAddress = await tx.customerAddress.findFirst({
        where: { customerId, isDefault: true }
      });

      const addressData = {
        addressLine1: customerInput.addressLine1,
        addressLine2: customerInput.addressLine2 || null,
        city: customerInput.city,
        state: customerInput.state,
        pincode: customerInput.pincode,
        country: customerInput.country,
        isDefault: true
      };

      if (existingDefaultAddress) {
        await tx.customerAddress.update({
          where: { id: existingDefaultAddress.id },
          data: addressData
        });
      } else {
        await tx.customerAddress.create({
          data: { ...addressData, customerId }
        });
      }

      return tx.order.create({
        data: {
          orderNumber: buildOrderNumber(),
          customerId,
          customerName: customerInput.fullName,
          mobile: customerInput.mobile,
          email: customerInput.email.trim().toLowerCase(),
          hospitalName: customerInput.hospitalName,
          gstNumber: customerInput.gstNumber || null,
          billingAddress: `${customerInput.addressLine1}, ${customerInput.city}`,
          shippingAddress: {
            addressLine1: customerInput.addressLine1,
            addressLine2: customerInput.addressLine2,
            city: customerInput.city,
            state: customerInput.state,
            pincode: customerInput.pincode,
            country: customerInput.country
          },
          subtotal,
          discountCode: coupon?.code ?? null,
          discountAmount,
          tax,
          shipping,
          total,
          paymentMethod: paymentMethodFromId(customerInput.paymentMethod),
          purchaseType: customerInput.purchaseType,
          items: {
            create: orderLines.map((line) => ({
              productId: line.product.id,
              productName: line.product.name,
              sku: line.product.sku,
              variant: line.variant,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              total: line.total
            }))
          }
        },
        include: { items: { include: { product: true } }, customer: true }
      });
    });

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
        orders: { include: { items: { include: { product: true } } } }
      }
    });

    return NextResponse.json({
      ok: true,
      order: mapOrder(created),
      customer: customer ? mapCustomerProfile(customer) : undefined
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save order." },
      { status: 500 }
    );
  }
}
