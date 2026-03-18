"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopifyProduct } from "@/lib/shopify";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TAGS = [
  { id: 'cuello', label: 'Cuello' },
  { id: 'espalda', label: 'Espalda' },
  { id: 'cadera', label: 'Cadera' },
  { id: 'hombro', label: 'Hombro' },
  { id: 'codo', label: 'Codo' },
  { id: 'rodilla', label: 'Rodilla' },
  { id: 'pata delantera', label: 'Pata frontal' },
  { id: 'pata trasera', label: 'Pata trasera' },
];

type Props = {
  initialProducts: ShopifyProduct[];
  initialCursor: string;
  initialHasNextPage: boolean;
  titleSlot?: React.ReactNode;
};

export function ProductGrid({ initialProducts, initialCursor, initialHasNextPage, titleSlot }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  async function loadMore() {
    setLoading(true);
    const res = await fetch(`/api/products?cursor=${cursor}`);
    const data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setCursor(data.cursor);
    setHasNextPage(data.hasNextPage);
    setLoading(false);
  }

  async function handleTagChange(tag: string) {
    const isAll = tag === "all";
    setActiveTag(isAll ? null : tag);
    setLoading(true);

    if (isAll) {
      setProducts(initialProducts);
      setCursor(initialCursor);
      setHasNextPage(initialHasNextPage);
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/products/tag/${tag}`);
    const data = await res.json();
    setProducts(data);
    setHasNextPage(false);
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Header row: title slot + filter */}
        <div className="flex items-end justify-between mb-8 w-full gap-4">
          <div>{titleSlot}</div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-medium">Filtrar</span>
            <Select value={activeTag ?? "all"} onValueChange={handleTagChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los productos" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    Todos los productos
                  </SelectItem>
                  {TAGS.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Explora más productos
            </FieldDescription>
          </div>
        </div>





        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#757575]">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load more — hidden when filtering */}
        {hasNextPage && !activeTag && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-[#1E1E1E] text-white font-semibold rounded hover:bg-[#333] disabled:opacity-50 transition"
            >
              {loading ? "Cargando..." : "Cargar más"}
            </button>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-xl text-[#757575]">No se encontraron productos.</p>
          </div>
        )}
      </div >
    </>
  );
}