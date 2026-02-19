"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopifyProduct } from "@/lib/shopify";
import { ShoppingCart, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { FloatingProductCard } from "./FloatingProductCard";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const [isCartHovered, setIsCartHovered] = React.useState(false);
  const image = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;

  const formatPrice = (price: { amount: string; currencyCode: string }) => 
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));

  const priceDisplay = minPrice.amount === maxPrice.amount 
    ? formatPrice(minPrice) 
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  return (
    <Dialog>
      <Card className=" flex flex-col h-full group/card">
        <CardHeader className="p-0">
          <DialogTrigger asChild>
            <div className="relative aspect-square w-full bg-muted cursor-zoom-in overflow-hidden">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
                  Sin imagen
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                <Search className="text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 w-8 h-8" />
              </div>
            </div>
          </DialogTrigger>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="line-clamp-1 text-lg">{product.title}</CardTitle>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
          <p className="mt-4 text-xl font-bold">
            {priceDisplay}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full overflow-hidden rounded-md border border-input h-10 relative bg-[#1E1E1E]">
            {/* 1. Ver Detalles Button (Base Layer) */}
            <button 
              className="flex-grow h-full text-sm font-medium text-white transition-opacity duration-300 cursor-pointer"
              onClick={() => console.log("Ver detalles: " + product.title)}
            >
              Ver detalles
            </button>

            {/* 2. Añadir al Carrito Overlay - Expands to cover 'Ver detalles' */}
            <button 
              className={`absolute top-0 bottom-0 right-0 z-20 flex items-center justify-center bg-[#8CC63F] transition-all duration-500 ease-in-out overflow-hidden cursor-pointer ${
                isCartHovered ? "left-0 w-full" : "w-0 opacity-0"
              }`}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
              onClick={() => console.log("Añadir al carrito: " + product.title)}
            >
              <span className="whitespace-nowrap text-sm font-medium text-white pr-10">
                Añadir al carrito
              </span>
            </button>

            {/* 3. Cart Icon Section (Fixed Right Corner) */}
            <div 
              className={`w-12 h-full flex items-center justify-center border-l border-white/20 cursor-pointer relative z-30 transition-colors duration-500 ${
                isCartHovered ? "bg-[#8CC63F] border-transparent" : "bg-[#1E1E1E]"
              }`}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </div>
        </CardFooter>
      </Card>

      <DialogContent showCloseButton={false} className="max-w-[95vw] sm:max-w-none w-fit p-0 bg-transparent border-none shadow-none outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <FloatingProductCard product={product} />
      </DialogContent>
    </Dialog>
  );
}
