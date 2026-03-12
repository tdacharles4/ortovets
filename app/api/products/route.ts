import { getProducts } from "@/lib/shopify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;

  const { body } = await getProducts(cursor);
  const edges = body.data.products.edges;

  return Response.json({
    products: edges.map((e) => e.node),
    cursor: edges.at(-1)?.cursor ?? null,
    hasNextPage: body.data.products.pageInfo.hasNextPage,
  });
}