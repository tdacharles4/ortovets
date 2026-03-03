
import { shopifyFetch } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const result = await shopifyFetch<any>({
      query: `
        query searchProducts($query: String!) {
          products(first: 5, query: $query) {
            edges {
              node {
                handle
                title
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { query: `title:${query}*` },
    });

    if (result.body.errors) {
      console.error('Shopify API Error:', result.body.errors);
      return NextResponse.json({ error: 'Failed to fetch from Shopify' }, { status: 500 });
    }
    
    const products = result.body.data.products.edges.map((edge: any) => ({
      handle: edge.node.handle,
      title: edge.node.title,
      imageUrl: edge.node.images.edges[0]?.node.url,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
