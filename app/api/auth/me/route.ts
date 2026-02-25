import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { refreshAccessToken } from '@/lib/shopify-auth';

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ authenticated: false });
  }

  // Check if token is expired (with 5 minute buffer)
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
    } catch (error) {
      // Refresh failed — session is dead
      session.destroy();
      return NextResponse.json({ authenticated: false });
    }
  }

  return NextResponse.json({
    authenticated: true,
    customerId: session.customerId,
  });
}
