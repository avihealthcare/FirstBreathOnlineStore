import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadRouteProps = {
  params: Promise<{ filename: string }>;
};

const CONTENT_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

function safeUploadPath(filename: string) {
  const decoded = decodeURIComponent(filename);
  const safeName = path.basename(decoded);
  if (safeName !== decoded || !/^[a-z0-9][a-z0-9._-]+\.(gif|jpe?g|png|webp)$/i.test(safeName)) {
    return null;
  }

  return path.join(process.cwd(), "public", "uploads", "products", safeName);
}

export async function GET(_request: Request, { params }: UploadRouteProps) {
  const { filename } = await params;
  const uploadPath = safeUploadPath(filename);

  if (!uploadPath) {
    return NextResponse.json({ ok: false, error: "Invalid image path." }, { status: 400 });
  }

  try {
    const file = await readFile(uploadPath);
    const extension = path.extname(uploadPath).toLowerCase();
    const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(file.byteLength),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Image not found." }, { status: 404 });
  }
}
