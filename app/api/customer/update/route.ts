
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken } from '@/lib/shopify-auth';
import { shopify } from '@/lib/shopify'; // Assuming you have a shopify client instance

const STOREFRONT_API_ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

const customerUpdateMutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

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
      session.expiresAt = Date.now() + newTokens.expires_in * 1000;
      await session.save();
    } catch {
      session.destroy();
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
  }

  const { firstName, lastName, phone } = await request.json();

  const variables = {
    customerAccessToken: session.accessToken,
    customer: {
      firstName,
      lastName,
      phone,
    },
  };

  try {
    const shopifyRes = await fetch(STOREFRONT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: customerUpdateMutation,
        variables,
      }),
    });

    const data = await shopifyRes.json();

    if (data.errors || data.data?.customerUpdate?.customerUserErrors.length > 0) {
      console.error('Shopify GraphQL Error:', data.errors || data.data.customerUpdate.customerUserErrors);
      return NextResponse.json({ error: 'Error from Shopify API', details: data.errors || data.data.customerUpdate.customerUserErrors }, { status: 500 });
    }

    return NextResponse.json({ success: true, customer: data.data.customerUpdate.customer });

  } catch (err: any) {
    console.error('Fetch error in /api/customer/update:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
