import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"]
]);

function detectImageExtension(bytes: Buffer) {
  if (bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return "png";
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "jpg";
  if (bytes.subarray(0, 4).toString("ascii") === "GIF8") return "gif";
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return "";
}

function extensionFor(file: File) {
  const byType = ALLOWED_TYPES.get(file.type);
  if (byType) return byType;

  const extension = path.extname(file.name).replace(/^\./, "").toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(extension) ? extension : "";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const files = formData?.getAll("files").filter((file): file is File => file instanceof File) ?? [];

  if (!files.length) {
    return NextResponse.json({ ok: false, error: "Select at least one image file." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const extension = extensionFor(file);
    if (!extension) {
      return NextResponse.json({ ok: false, error: `${file.name} is not a supported image type.` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: `${file.name} is larger than 5 MB.` }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const detectedExtension = detectImageExtension(bytes);

    if (!detectedExtension) {
      return NextResponse.json({ ok: false, error: `${file.name} is not a valid image file.` }, { status: 400 });
    }

    const safeBaseName = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);
    const filename = `${safeBaseName || "product"}-${randomUUID()}.${detectedExtension || extension}`;

    await writeFile(path.join(uploadDir, filename), bytes);
    urls.push(`/uploads/products/${filename}`);
  }

  return NextResponse.json({ ok: true, urls });
}
