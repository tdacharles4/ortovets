import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

export default async function Tienda() {
  const { body } = await getProducts();
  const products = body.data.products.edges.map((edge) => edge.node);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-center uppercase tracking-tight">Nuestros Productos</h1>
        <p className="mt-4 text-center text-muted-foreground text-lg max-w-2xl mx-auto">
          Explora nuestra selección de productos ortopédicos diseñados para el bienestar y la movilidad de tu mascota.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
