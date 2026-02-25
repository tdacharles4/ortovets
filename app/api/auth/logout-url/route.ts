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
    const params = logoutUrl.searchParams;

    // The id_token_hint is recommended by the OpenID spec to prevent
    // the user being asked "who are you logging out of?"
    if (session.idToken) {
      params.set('id_token_hint', session.idToken);
    }
    
    // Tell Shopify where to redirect the user (in the popup) after logout is complete.
    params.set(
      'post_logout_redirect_uri',
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout-callback`
    );

    return NextResponse.json({ logoutUrl: logoutUrl.toString() });
  } catch (error) {
    console.error('Failed to get logout URL', error);
    return NextResponse.json(
      { error: 'Failed to construct logout URL' },
      { status: 500 }
    );
  }
}
