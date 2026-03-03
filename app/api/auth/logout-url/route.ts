import { NextResponse } from 'next/server';
import { getOpenIDConfig } from '@/lib/shopify-auth';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const [config, session] = await Promise.all([
      getOpenIDConfig(),
      getSession(),
    ]);

    const logoutUrl = new URL(config.end_session_endpoint);

    // The id_token_hint is required by Shopify to identify which user session to log out.
    if (session.idToken) {
      logoutUrl.searchParams.set('id_token_hint', session.idToken);
    }

    // Adding client_id and post_logout_redirect_uri is often required or recommended
    // to avoid "Invalid id_token" or redirect issues.
    logoutUrl.searchParams.set('client_id', process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!);
    
    const logoutCallbackUrl = `${origin}/api/auth/logout-callback`;
    logoutUrl.searchParams.set('post_logout_redirect_uri', logoutCallbackUrl);

    return NextResponse.json({ logoutUrl: logoutUrl.toString() });
  } catch (error) {
    console.error('Failed to get logout URL', error);
    return NextResponse.json(
      { error: 'Failed to construct logout URL' },
      { status: 500 }
    );
  }
}
