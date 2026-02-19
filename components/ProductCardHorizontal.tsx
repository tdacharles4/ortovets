"use client";

import * as React from "react";
import Image from "next/image";
import { ShopifyProduct } from "@/lib/shopify";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { FloatingProductCard } from "./FloatingProductCard";

export function ProductCardHorizontal({ product }: { product: ShopifyProduct }) {
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
      <div className="flex flex-row w-[476px] h-[148px] bg-[#FFFFFF] rounded-[32px] overflow-hidden items-center p-[9px] gap-[16px] hover:shadow-lg transition-shadow group/hcard">
        {/* Image Frame - 130x130px */}
        <DialogTrigger asChild>
          <div className="relative w-[130px] h-[130px] shrink-0 rounded-[24px] overflow-hidden bg-muted cursor-zoom-in">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover/hcard:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground bg-muted">
                Sin imagen
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover/hcard:bg-black/10 transition-colors duration-500 flex items-center justify-center">
              <Search className="text-white opacity-0 group-hover/hcard:opacity-100 transition-opacity duration-500 w-6 h-6" />
            </div>
          </div>
        </DialogTrigger>

        {/* Info Frame */}
        <div className="flex flex-col justify-center gap-1 overflow-hidden pr-4 flex-grow">
          {/* Product Title: Body/Regular, Large Size, 140% line height */}
          <h3 className="text-[#1E1E1E] font-sans font-normal text-lg leading-[1.4] line-clamp-2">
            {product.title}
          </h3>
          {/* Price: Heading/SemiBold, Base Size, 120% line height */}
          <p className="text-[#1E1E1E] font-sans font-semibold text-base leading-[1.2]">
            {priceDisplay}
          </p>
        </div>
      </div>

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
