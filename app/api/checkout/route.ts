import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { items } = await req.json();

  if (!items || !items.length) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const lines = items.map((item: any) => ({
    merchandiseId: item.id,
    quantity: item.quantity,
  }));

  try {
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: `
            mutation cartCreate($input: CartInput!) {
              cartCreate(input: $input) {
                cart {
                  id
                  checkoutUrl
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: { input: { lines } },
        }),
      }
    );

    const json = await response.json();

    // Check for Shopify errors
    const userErrors = json.data?.cartCreate?.userErrors;
    if (userErrors && userErrors.length) {
      console.error("Shopify userErrors:", JSON.stringify(userErrors, null, 2));
      return NextResponse.json(
        { error: "Shopify cart creation failed", details: userErrors },
        { status: 500 }
      );
    }

    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      console.error("No checkout URL returned:", JSON.stringify(json, null, 2));
      return NextResponse.json({ error: "Failed to get checkout URL" }, { status: 500 });
    }

    return NextResponse.json({ webUrl: checkoutUrl });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
