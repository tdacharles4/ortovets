import { getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";

export default async function Tienda() {
  const { body } = await getProducts();
  const edges = body.data.products.edges;

  return (
    <div className="w-full max-w-[1920px] mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#1E1E1E]">
          Nuestros Productos
        </h1>
        <p className="mt-4 text-[#757575] text-base md:text-lg max-w-2xl mx-auto">
          Explora nuestra selección de productos ortopédicos diseñados para el bienestar y la movilidad de tu mascota.
        </p>
      </div>

      <ProductGrid
        initialProducts={edges.map((e) => e.node)}
        initialCursor={edges.at(-1)?.cursor ?? ""}
        initialHasNextPage={body.data.products.pageInfo.hasNextPage}
      />
    </div>
  );
}
