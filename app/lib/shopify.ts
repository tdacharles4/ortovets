import { cookies } from "next/headers";

export async function shopifyFetch(query: string, variables = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  return response.json();  
}

export async function getCustomer() {
  const query = `
    query {
      customer {
        id
        email
        tags
      }
    }
  `;

  const { data } = await shopifyFetch(query);

  return data?.customer ?? null;
}