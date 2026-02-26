import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { exchangeCodeForTokens } from '@/lib/shopify-auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Return an HTML page that posts messages to the opener
  const sendMessage = (type: 'AUTH_SUCCESS' | 'AUTH_ERROR', payload?: object) => {
    const message = JSON.stringify({ type, ...payload });
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head><title>Authenticating...</title></head>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage(${message}, '${process.env.NEXT_PUBLIC_APP_URL}');
      }
      window.close();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  };

  if (error) {
    console.error('Shopify auth error:', error);
    return sendMessage('AUTH_ERROR', { error });
  }

  if (!code || !state) {
    return sendMessage('AUTH_ERROR', { error: 'Missing code or state' });
  }

  try {
    const session = await getSession();

    // CSRF protection — state must match
    if (state !== session.state) {
      return sendMessage('AUTH_ERROR', {
        error: 'State mismatch — possible CSRF attack',
      });
    }

    const codeVerifier = session.codeVerifier;
    if (!codeVerifier) {
      return sendMessage('AUTH_ERROR', { error: 'Missing code verifier' });
    }

    const callbackUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL!;
    const tokens = await exchangeCodeForTokens(code, codeVerifier, callbackUrl);

    // Decode the ID token to extract the customer ID (sub claim)
    // We're not doing full JWT verification here — Shopify's server already verified the code
    // But you can add full JWKS verification if you want to be extra strict
    const idTokenParts = tokens.id_token.split('.');
    const idTokenPayload = JSON.parse(
      Buffer.from(idTokenParts[1], 'base64url').toString()
    );

    // Store tokens in session (server-side, httpOnly cookie — never exposed to browser)
    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    session.idToken = tokens.id_token;
    session.customerId = idTokenPayload.sub; // "gid://shopify/Customer/123456"
    session.expiresAt = Date.now() + tokens.expires_in * 1000;

    // Clear PKCE temps
    session.codeVerifier = undefined;
    session.state = undefined;
    session.nonce = undefined;

    await session.save();

    return sendMessage('AUTH_SUCCESS', {
      customerId: idTokenPayload.sub,
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return sendMessage('AUTH_ERROR', { error: 'Token exchange failed' });
  }
}
