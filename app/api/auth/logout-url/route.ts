import { NextResponse } from 'next/server';
import { getOpenIDConfig } from '@/lib/shopify-auth';

export async function GET() {
  try {
    const config = await getOpenIDConfig();

    // Just return the bare logout endpoint. 
    // Shopify handles the session revocation and knows where to redirect 
    // based on the 'Headless' channel configuration.
    return NextResponse.json({ logoutUrl: config.end_session_endpoint });
  } catch (error) {
    console.error('Failed to get logout URL', error);
    return NextResponse.json(
      { error: 'Failed to construct logout URL' },
      { status: 500 }
    );
  }
}
