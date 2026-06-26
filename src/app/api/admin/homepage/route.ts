import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { HeroSettings } from "@/types";

export const runtime = "nodejs";

function isHeroSettings(value: Partial<HeroSettings> | null): value is HeroSettings {
  return Boolean(value?.headline && value.subheadline && value.image && value.primaryCtaLabel);
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { hero?: Partial<HeroSettings> } | null;
  const hero = body?.hero ?? null;

  if (!isHeroSettings(hero)) {
    return NextResponse.json({ ok: false, error: "Invalid homepage details." }, { status: 400 });
  }

  const existing = await prisma.homepageContent.findFirst({ orderBy: { updatedAt: "desc" } });
  const data = {
    eyebrow: hero.eyebrow,
    headline: hero.headline,
    subheadline: hero.subheadline,
    primaryCtaLabel: hero.primaryCtaLabel,
    primaryCtaHref: hero.primaryCtaHref,
    secondaryCtaLabel: hero.secondaryCtaLabel,
    secondaryCtaHref: hero.secondaryCtaHref,
    image: hero.image,
    imageAlt: hero.imageAlt,
    calloutTitle: hero.calloutTitle,
    calloutText: hero.calloutText
  };

  const saved = existing
    ? await prisma.homepageContent.update({ where: { id: existing.id }, data })
    : await prisma.homepageContent.create({ data });

  return NextResponse.json({
    ok: true,
    hero: {
      eyebrow: saved.eyebrow,
      headline: saved.headline,
      subheadline: saved.subheadline,
      primaryCtaLabel: saved.primaryCtaLabel,
      primaryCtaHref: saved.primaryCtaHref,
      secondaryCtaLabel: saved.secondaryCtaLabel,
      secondaryCtaHref: saved.secondaryCtaHref,
      image: saved.image,
      imageAlt: saved.imageAlt,
      calloutTitle: saved.calloutTitle,
      calloutText: saved.calloutText
    }
  });
}
