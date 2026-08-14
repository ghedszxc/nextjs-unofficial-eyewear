import { getProductVariants } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") as Language;
  const id = searchParams.get("id");

  if (!lang || !id) {
    return NextResponse.json({ success: false, error: "Missing lang or id parameter" }, { status: 400 });
  }

  const result = await getProductVariants(lang, id);

  if (!result.success) {
    // Preserve the real upstream status (404 vs 429/5xx) so callers can
    // distinguish a missing record from a transient Storyblok failure.
    const message = result.error?.message ?? (result as any)?.errors?.message ?? "Failed to fetch stories";
    return NextResponse.json({ success: false, error: message }, { status: result.status ?? 500 });
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}
