import { NextRequest, NextResponse } from 'next/server';
import { getShopifyAdminToken } from '@/lib/shopify-admin';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName } = await req.json();

    // 1. Fetch the temporary admin token
    const adminToken = await getShopifyAdminToken();

    // 2. Define the GraphQL mutation to accept tags
    const customerCreateMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // 3. Construct the variables using the 'tags' method
    const variables = {
      input: {
        email,
        firstName,
        lastName,
        tags: ["Needs Approval"],
      },
    };

    // 4. Make the GraphQL request to Shopify Admin API
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
      return NextResponse.json(
        { success: false, message: 'An unexpected error occurred during GraphQL execution.' },
        { status: 500 }
      );
    }

    const customerData = jsonResponse.data.customerCreate;

    if (customerData.userErrors && customerData.userErrors.length > 0) {
      console.error('Shopify User Errors:', customerData.userErrors);
      return NextResponse.json(
        { success: false, message: customerData.userErrors[0].message },
        { status: 400 }
      );
    }

    if (customerData.customer) {
      return NextResponse.json({
        success: true,
        message: '¡Registro exitoso! Su cuenta está pendiente de aprobación por un administrador.',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'No se pudo crear la cuenta.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in registration route:', error);
    return NextResponse.json(
      { success: false, message: 'Ocurrió un error en el servidor.' },
      { status: 500 }
    );
  }
}
