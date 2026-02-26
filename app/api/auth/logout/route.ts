import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { revokeSession } from '@/lib/shopify-auth';
import { getOpenIDConfig } from '@/lib/shopify-auth';

export async function POST() {
  try {
    const session = await getSession();
    const idToken = session.idToken;

    // Destroy local session
    session.destroy();

    // Revoke Shopify session if we have the ID token
    if (idToken) {
      try {
        await revokeSession(idToken);
      } catch (e) {
        // Don't block logout if Shopify revocation fails
        console.error('Shopify session revocation failed:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
