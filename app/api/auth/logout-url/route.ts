import { NextResponse } from 'next/server';
import { getOpenIDConfig } from '@/lib/shopify-auth';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const [config, session] = await Promise.all([
      getOpenIDConfig(),
      getSession(),
    ]);

    const logoutUrl = new URL(config.end_session_endpoint);

    // The id_token_hint is required by Shopify to identify which user session to log out.
    if (session.idToken) {
      logoutUrl.searchParams.set('id_token_hint', session.idToken);
    }
    // Per user's instruction, post_logout_redirect_uri is handled by the Shopify config.

    return NextResponse.json({ logoutUrl: logoutUrl.toString() });
  } catch (error) {
    console.error('Failed to get logout URL', error);
    return NextResponse.json(
      { error: 'Failed to construct logout URL' },
      { status: 500 }
    );
  }
}
