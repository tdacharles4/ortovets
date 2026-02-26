import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  customerId?: string;
  expiresAt?: number; // unix timestamp

  // PKCE temps — stored here during the auth flow, cleared after
  codeVerifier?: string;
  state?: string;
  nonce?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'shopify_auth_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}
