import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getShopifyAdminToken } from '@/lib/shopify-admin';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

const customerUpdateMutation = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.accessToken || !session.customerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { firstName, lastName, phone } = await request.json();

  try {
    const adminToken = await getShopifyAdminToken();

    const rawCustomerId = String(session.customerId);
    const customerId = rawCustomerId.startsWith('gid://') 
      ? rawCustomerId 
      : `gid://shopify/Customer/${rawCustomerId}`;

    const variables = {
      input: {
        id: customerId,
        firstName,
        lastName,
        phone,
      },
    };

    const shopifyRes = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: customerUpdateMutation,
        variables,
      }),
    });

    const data = await shopifyRes.json();

    if (data.errors || (data.data?.customerUpdate?.userErrors && data.data.customerUpdate.userErrors.length > 0)) {
      console.error('Shopify Admin API Error:', data.errors || data.data.customerUpdate.userErrors);
      return NextResponse.json({ 
        error: 'Error from Shopify API', 
        details: data.errors || data.data.customerUpdate.userErrors 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      customer: data.data.customerUpdate.customer 
    });

  } catch (err: any) {
    console.error('Fetch error in /api/customer/update:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
