"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct, getMenudeoPriceRange } from "@/lib/shopify";
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

  const menudeoPriceRange = getMenudeoPriceRange(product);
  const minPrice = menudeoPriceRange.minVariantPrice;
  const maxPrice = menudeoPriceRange.maxVariantPrice;

  const formatPrice = (price: { amount: string; currencyCode: string }) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));

  const priceDisplay = minPrice.amount === maxPrice.amount
    ? formatPrice(minPrice)
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  const cardClasses = "flex flex-row w-full min-h-[148px] bg-[#FFFFFF]/60 rounded-[32px] overflow-hidden items-center p-2 sm:p-[9px] gap-4 sm:gap-[16px] hover:shadow-lg transition-shadow group/hcard mx-auto";

  const imageSlot = (
    <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] shrink-0 rounded-[24px] overflow-hidden bg-muted">
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
    </div>
  );

  const infoSlot = (
    <div className="flex flex-col justify-center gap-1 overflow-hidden pr-4 flex-grow">
      <h3 className="text-[##1E2939] font-sans font-normal text-lg leading-[1.4] line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 400 }}>
        {product.title}
      </h3>
      <p className="text-[#1E1E1E] font-sans font-semibold text-base leading-[1.2]">
        {priceDisplay}
      </p>
    </div>
  );

  return (
    <Dialog>
      {/* Mobile: go directly to product page */}
      <Link href={`/tienda/${product.handle}`} className={`${cardClasses} md:hidden`}>
        {imageSlot}
        {infoSlot}
      </Link>

      {/* Desktop: open quick-view modal */}
      <DialogTrigger asChild>
        <div className={`${cardClasses} hidden md:flex cursor-zoom-in`}>
          <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] shrink-0 rounded-[24px] overflow-hidden bg-muted">
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
          {infoSlot}
        </div>
      </DialogTrigger>

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
