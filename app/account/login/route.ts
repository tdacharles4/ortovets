import { NextResponse } from "next/server";

export async function GET() {
  const returnTo = encodeURIComponent(
    process.env.NEXT_PUBLIC_SITE_URL!
  );

  return NextResponse.redirect(
    `https://shopify.com/authentication/${process.env.SHOPIFY_STORE_ID}/login?return_to=${returnTo}`
  );
}