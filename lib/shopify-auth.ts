const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;

interface OpenIDConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  issuer: string;
}

let cachedConfig: OpenIDConfig | null = null;

export async function getOpenIDConfig(): Promise<OpenIDConfig> {
  if (cachedConfig) return cachedConfig;

  const res = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/openid-configuration`,
    {
      next: { revalidate: 3600 },
    } // cache for 1 hour
  );

  if (!res.ok) throw new Error('Failed to fetch OpenID configuration');

  cachedConfig = await res.json();
  return cachedConfig!;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<TokenResponse> {
  const config = await getOpenIDConfig();
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!,
    client_secret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET!,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });

  const res = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const config = await getOpenIDConfig();
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!,
    client_secret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  const res = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) throw new Error('Token refresh failed');

  return res.json();
}

export async function revokeSession(idToken: string): Promise<void> {
  const config = await getOpenIDConfig();
  await fetch(config.end_session_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      id_token_hint: idToken,
      client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!,
    }).toString(),
  });
}
