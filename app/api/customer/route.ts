import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken } from '@/lib/shopify-auth';

// This is the correct, standard Storefront API endpoint
const STOREFRONT_API_ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Refresh token if it's about to expire
  const isExpired = session.expiresAt
    ? Date.now() > session.expiresAt - 5 * 60 * 1000
    : false;

  if (isExpired && session.refreshToken) {
    try {
      const newTokens = await refreshAccessToken(session.refreshToken);
      session.accessToken = newTokens.access_token;
      session.refreshToken = newTokens.refresh_token;
      session.idToken = newTokens.id_token;
      session.expiresAt = Date.now() + newTokens.expires_in * 1000;
      await session.save();
    } catch {
      session.destroy();
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
  }

  const body = await request.json(); // This contains the { query } from the frontend

  // **THE FIX IS HERE:** We create a variables object and add the access token to it,
  // as required by the 'customer' query in the Storefront API.
  const shopifyRequestBody = {
    query: body.query,
    variables: {
      customerAccessToken: session.accessToken,
    },
  };

  try {
    const shopifyRes = await fetch(STOREFRONT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify(shopifyRequestBody), // Send the modified body with the token variable
    });

    const data = await shopifyRes.json();
    
    if (data.errors || !shopifyRes.ok) {
        console.error('Shopify GraphQL Error:', data.errors);
        return NextResponse.json({ error: 'Error from Shopify API', details: data.errors }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err: any) {
    console.error('Fetch error in /api/customer:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
