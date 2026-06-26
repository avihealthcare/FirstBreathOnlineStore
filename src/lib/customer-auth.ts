import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { CustomerProfile } from "@/types";

export const CUSTOMER_COOKIE = "avi-customer-session";

function getSecret() {
  return process.env.CUSTOMER_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "avi-firstbreath-local-customer-secret";
}

export function signCustomerSession(customerId: string) {
  const value = `customer:${customerId}`;
  const signature = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function verifyCustomerSession(session: string | undefined) {
  if (!session) return null;
  const decodedSession = safeDecodeCookieValue(session);
  const separator = decodedSession.lastIndexOf(".");
  if (separator <= 0) return null;

  const value = decodedSession.slice(0, separator);
  const signature = decodedSession.slice(separator + 1);
  const expected = signCustomerSession(value.replace(/^customer:/, "")).split(".")[1];
  const valid =
    Buffer.from(signature).length === Buffer.from(expected).length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid || !value.startsWith("customer:")) return null;
  return value.replace(/^customer:/, "");
}

function safeDecodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getCurrentCustomerId() {
  const cookieStore = await cookies();
  return verifyCustomerSession(cookieStore.get(CUSTOMER_COOKIE)?.value);
}

export async function getCurrentCustomer() {
  const customerId = await getCurrentCustomerId();
  if (!customerId) return null;
  return prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        take: 20
      }
    }
  });
}

type CustomerForProfile = {
  id: string;
  fullName: string | null;
  mobile: string | null;
  email: string | null;
  hospitalName: string | null;
  gstNumber: string | null;
  billingAddress: string | null;
  savedProductSlugs: string[];
  recentlyPurchasedSlugs: string[];
  addresses: {
    id: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }[];
};

export function mapCustomerProfile(customer: CustomerForProfile): CustomerProfile {
  return {
    id: customer.id,
    fullName: customer.fullName ?? "",
    mobile: customer.mobile ?? "",
    email: customer.email ?? "",
    hospitalName: customer.hospitalName ?? "",
    gstNumber: customer.gstNumber ?? "",
    billingAddress: customer.billingAddress ?? undefined,
    addresses: customer.addresses.map((address) => ({
      id: address.id,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? undefined,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault
    })),
    savedProductSlugs: customer.savedProductSlugs,
    recentlyPurchasedSlugs: customer.recentlyPurchasedSlugs
  };
}
