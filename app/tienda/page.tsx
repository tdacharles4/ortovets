import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

export default async function Tienda() {
  const { body } = await getProducts();
  const products = body.data.products.edges.map((edge) => edge.node);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No se encontraron productos.</p>
        </div>
      )}
    </div>
  );
}
