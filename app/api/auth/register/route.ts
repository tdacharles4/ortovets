import { NextRequest, NextResponse } from 'next/server';
import { getShopifyAdminToken } from '@/lib/shopify-admin';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, cedula } = await req.json();

    // 1. Fetch the temporary admin token
    const adminToken = await getShopifyAdminToken();

    // 2. Define the GraphQL mutation to include metafields
    const customerCreateMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            tags
            metafield(namespace: "custom", key: "cedula_profesional") {
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // 3. Construct the variables, adding the metafield if cedula is present
    const variables = {
      input: {
        email,
        firstName,
        lastName,
        tags: ["Needs Approval"],
        metafields: cedula
          ? [
              {
                namespace: "custom",
                key: "cedula_profesional",
                value: cedula,
                type: "single_line_text_field",
              },
            ]
          : [],
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
      // 5. Send notification email if cedula was provided
      if (cedula && process.env.STORE_OWNER_EMAIL) {
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev', // Replace with a domain you have verified with Resend
            to: process.env.STORE_OWNER_EMAIL,
            subject: 'Nuevo Registro de Veterinario para Aprobación',
            html: `
              <p>Un nuevo veterinario se ha registrado y está pendiente de aprobación.</p>
              <ul>
                <li><strong>Nombre:</strong> ${firstName} ${lastName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Cédula Profesional:</strong> ${cedula}</li>
              </ul>
              <p>Puedes aprobar al cliente en el <a href="https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/customers/${customerData.customer.id.split('/').pop()}">panel de clientes de Shopify</a>.</p>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
          // Do not block the user response for an email failure. Log it for debugging.
        }
      }

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
