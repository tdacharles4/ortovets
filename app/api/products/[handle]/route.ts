import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

export async function GET(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const handle = (await params).handle;
    const { body } = await getProduct(handle);

    if (!body.data.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(body.data.product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
