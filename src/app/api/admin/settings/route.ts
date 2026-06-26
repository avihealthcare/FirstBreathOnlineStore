import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStoreSettings } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { storeSettingsSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = storeSettingsSchema.safeParse(body?.settings);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid store settings." }, { status: 400 });
  }

  const current = await getStoreSettings();
  const saved = await prisma.storeSetting.upsert({
    where: { id: current.id ?? "seed-store-settings" },
    update: {
      ...parsed.data,
      whatsappNumber: parsed.data.whatsappNumber || null,
      gstNumber: parsed.data.gstNumber || null
    },
    create: {
      id: current.id ?? "seed-store-settings",
      ...parsed.data,
      whatsappNumber: parsed.data.whatsappNumber || null,
      gstNumber: parsed.data.gstNumber || null
    }
  });

  return NextResponse.json({
    ok: true,
    settings: {
      id: saved.id,
      companyName: saved.companyName,
      companyAddress: saved.companyAddress,
      contactEmail: saved.contactEmail,
      phoneNumber: saved.phoneNumber,
      whatsappNumber: saved.whatsappNumber ?? "",
      gstNumber: saved.gstNumber ?? "",
      footerText: saved.footerText,
      privacyPolicy: saved.privacyPolicy,
      termsAndConditions: saved.termsAndConditions,
      shippingPolicy: saved.shippingPolicy,
      returnPolicy: saved.returnPolicy
    }
  });
}
