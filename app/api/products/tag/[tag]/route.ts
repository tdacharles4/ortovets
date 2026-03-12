import { NextRequest, NextResponse } from 'next/server';
import { getProductsByTag } from '@/lib/shopify';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params;
    const { body } = await getProductsByTag(tag);
    const products = body.data.products.edges.map((edge) => edge.node);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}