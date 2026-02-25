import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken } from '@/lib/shopify-auth';

const CUSTOMER_API_ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/account/customer/api/2026-01/graphql`;

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Refresh if needed
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

  const body = await request.json();

  const shopifyRes = await fetch(CUSTOMER_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: session.accessToken,
    },
    body: JSON.stringify(body),
  });

  const data = await shopifyRes.json();
  return NextResponse.json(data);
}
