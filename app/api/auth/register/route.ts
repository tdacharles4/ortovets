
import { NextRequest, NextResponse } from 'next/server';
import { getShopifyAdminToken } from '../../../../../lib/shopify-admin';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // 1. Fetch the temporary admin token
    const adminToken = await getShopifyAdminToken();

    // 2. Define the GraphQL mutation
    const customerCreateMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            state
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password,
        firstName,
        lastName,
        state: "DISABLED"
      }
    };

    // 3. Make the GraphQL request to Shopify Admin API
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: customerCreateMutation,
        variables,
      }),
    });

    const jsonResponse = await response.json();
    
    if (jsonResponse.errors) {
      console.error('GraphQL Errors:', jsonResponse.errors);
      return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
    
    const { customer, userErrors } = jsonResponse.data.customerCreate;

    if (userErrors && userErrors.length > 0) {
      console.error('Shopify User Errors:', userErrors);
      return NextResponse.json({ success: false, message: userErrors[0].message }, { status: 400 });
    }

    if (customer) {
      return NextResponse.json({ success: true, message: '¡Registro exitoso! Su cuenta está pendiente de aprobación.' });
    } else {
      return NextResponse.json({ success: false, message: 'No se pudo crear la cuenta.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in registration route:', error);
    return NextResponse.json({ success: false, message: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
