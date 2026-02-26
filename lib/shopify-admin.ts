
export async function getShopifyAdminToken() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_ADMIN_APP_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_APP_CLIENT_SECRET;

  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch Shopify admin token:', errorText);
    throw new Error('Failed to fetch Shopify admin token');
  }

  const { access_token } = await response.json();
  return access_token;
}
