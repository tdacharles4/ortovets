import { NextRequest, NextResponse } from 'next/server';
import { cookies, cookies as Next } from 'next/headers';

const storefrontAPI = async (query: string, variables: object) => {
    const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query, variables }),
    });
    return response.json();
};

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const loginMutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
  `;

  try {
    const { data, errors } = await storefrontAPI(loginMutation, {
        
      input: { email, password },
    });
    
    console.log(JSON.stringify({ data, errors }, null, 2));
    
    if (errors) {
        throw new Error(errors[0].message);
    }
    
    const result = data.customerAccessTokenCreate;

    if (result.customerUserErrors.length > 0) {
      return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
    }

    const accessToken = result.customerAccessToken?.accessToken;
    if (!accessToken) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Set the access token in a secure, http-only cookie
    (await
          // Set the access token in a secure, http-only cookie
          cookies()).set('customer_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}