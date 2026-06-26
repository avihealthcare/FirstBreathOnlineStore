import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { slugify } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import type { PaymentOption } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { option?: PaymentOption } | null;
  const option = body?.option;

  if (!option?.label || !option.description) {
    return NextResponse.json({ ok: false, error: "Payment label and description are required." }, { status: 400 });
  }

  const code = slugify(option.id || option.label);
  const saved = await prisma.paymentOptionSetting.upsert({
    where: { code },
    update: {
      label: option.label,
      description: option.description,
      isActive: option.isActive,
      bankName: option.bankName || null,
      accountName: option.accountName || null,
      accountNumber: option.accountNumber || null,
      ifsc: option.ifsc || null,
      branch: option.branch || null,
      instructions: option.instructions || null
    },
    create: {
      code,
      label: option.label,
      description: option.description,
      isActive: option.isActive,
      bankName: option.bankName || null,
      accountName: option.accountName || null,
      accountNumber: option.accountNumber || null,
      ifsc: option.ifsc || null,
      branch: option.branch || null,
      instructions: option.instructions || null
    }
  });

  return NextResponse.json({
    ok: true,
    option: {
      id: saved.code,
      label: saved.label,
      description: saved.description,
      isActive: saved.isActive,
      bankName: saved.bankName ?? undefined,
      accountName: saved.accountName ?? undefined,
      accountNumber: saved.accountNumber ?? undefined,
      ifsc: saved.ifsc ?? undefined,
      branch: saved.branch ?? undefined,
      instructions: saved.instructions ?? undefined
    }
  });
}
