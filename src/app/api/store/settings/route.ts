import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({ ok: true, settings });
}
