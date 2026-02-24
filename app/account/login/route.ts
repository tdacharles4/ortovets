import { NextResponse } from "next/server";

export async function GET() {
  const returnTo = encodeURIComponent(
    process.env.SHOPIFY_STORE_DOMAIN!
  );

  return NextResponse.redirect(
    `https://shopify.com/authentication/${process.env.SHOPIFY_STORE_ID}/login?return_to=${returnTo}`
  );
}