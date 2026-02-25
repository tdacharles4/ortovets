import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getOpenIDConfig } from '@/lib/shopify-auth';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
} from '@/lib/pkce';

export async function GET(request: Request) {
  try {
    const config = await getOpenIDConfig();
    const session = await getSession();

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();
    const nonce = generateNonce();

    // Store in session — these are validated at callback time
    session.codeVerifier = codeVerifier;
    session.state = state;
    session.nonce = nonce;
    await session.save();

    const callbackUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL!;
    const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!;

    const url = new URL(config.authorization_endpoint);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', callbackUrl);
    url.searchParams.set('scope', 'openid email customer-account-api:full');
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');

    return NextResponse.json({ authUrl: url.toString() });
  } catch (error) {
    console.error('Login init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize login' },
      { status: 500 }
    );
  }
}
