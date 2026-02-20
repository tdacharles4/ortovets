"use client";

import * as React from "react";
import Image from "next/image";
import { ShopifyProduct } from "@/lib/shopify";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

export function ProductPageContent({ product }: { product: ShopifyProduct }) {
  const allImages = product.images?.edges?.map(edge => edge.node) || [];
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = React.useState(0);
  
  const sizes = Array.from(new Set(
    product.variants?.edges?.map(edge => {
      const options = edge.node.selectedOptions;
      const sizeOpt = options.find(opt => 
        ['size', 'talla', 'tamaño', 'tamaño de accesorio'].includes(opt.name.toLowerCase())
      );
      if (!sizeOpt && options.length === 1 && options[0].name !== 'Title') {
        return options[0].value;
      }
      return sizeOpt?.value;
    }).filter(Boolean) || []
  )) as string[];

  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(undefined);

  const selectedVariant = product.variants?.edges?.find(edge => 
    edge.node.selectedOptions.some(opt => 
      ['size', 'talla', 'tamaño', 'tamaño de accesorio'].includes(opt.name.toLowerCase()) && 
      opt.value === selectedSize
    ) || (edge.node.selectedOptions.length === 1 && edge.node.selectedOptions[0].value === selectedSize)
  )?.node;

  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  
  const formatPrice = (price: { amount: string; currencyCode: string }) => 
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));

  let priceDisplay = "";
  if (selectedSize && selectedVariant) {
    priceDisplay = formatPrice(selectedVariant.price);
  } else if (minPrice.amount === maxPrice.amount) {
    priceDisplay = formatPrice(minPrice);
  } else {
    priceDisplay = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  }

  const mainImage = allImages[selectedImageIndex] || allImages[0];

  const handlePrev = () => {
    if (allImages.length === 0) return;
    setCarouselStartIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    if (allImages.length === 0) return;
    setCarouselStartIndex(prev => (prev + 1) % allImages.length);
  };

  const visibleImages = [];
  if (allImages.length > 0) {
    for (let i = 0; i < 4; i++) {
      const index = (carouselStartIndex + i) % allImages.length;
      if (allImages[index]) {
        visibleImages.push({ img: allImages[index], actualIndex: index });
      }
    }
  }

  const isOutOfStock = selectedSize 
    ? (selectedVariant ? !selectedVariant.availableForSale : true)
    : !product.availableForSale;

  return (
    <section className="w-full max-w-[1792px] h-fit min-h-[736px] flex flex-row gap-[64px] mx-auto">
      {/* Images Frame*/}
      <div className="flex flex-col w-[816px] gap-[24px] shrink-0">
        {/* Main Image Container */}
        <div className="relative w-[816px] h-[500px] bg-muted overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted text-xl">
              Sin imagen
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="flex items-center w-full gap-2">
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <div className="flex flex-row gap-[16px] flex-grow overflow-hidden">
            {visibleImages.map((item, idx) => (
              <div 
                key={`${item.img.url}-${idx}`}
                onClick={() => setSelectedImageIndex(item.actualIndex)}
                className={`relative aspect-square flex-grow shrink-0 bg-muted cursor-pointer border-2 transition-colors ${
                  selectedImageIndex === item.actualIndex ? "border-[#8CC63F]" : "border-transparent hover:border-muted"
                }`}
                style={{ width: 'calc((100% - 48px) / 4)' }}
              >
                <Image
                  src={item.img.url}
                  alt={item.img.altText || `Thumbnail ${item.actualIndex}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Product Info Frame */}
      <div className="flex flex-col flex-grow gap-8 pt-4">
        {/* Title and Price Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Product Name - Heading SemiBold Base 120% */}
          <h1 className="text-[#1E1E1E] font-sans font-semibold text-4xl leading-[1.2]">
            {product.title}
          </h1>
          {/* Price Range - Title Page Bold Base */}
          <p className="text-[#1E1E1E] font-sans font-bold text-2xl">
            {priceDisplay}
          </p>
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="text-[#757575] font-sans font-normal text-lg leading-[1.6]">
            {product.description}
          </p>
        </div>

        {/* Interaction Section - Full width of info frame */}
        <div className="flex flex-col gap-6 w-full">
          {/* Talla Select */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-3 w-full">
              <Label htmlFor="size-select-page" className="text-[#1E1E1E] font-sans font-medium text-lg">Talla</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size-select-page" className="w-full h-14 rounded-[12px] border-input text-lg">
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size!} className="text-lg">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Add to Cart Button */}
          <button 
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-3 w-full text-white h-16 rounded-[12px] font-bold text-xl transition-all ${
              isOutOfStock ? "bg-gray-500 cursor-not-allowed" : "bg-[#8CC63F] hover:bg-[#7ab236] shadow-xl shadow-[#8CC63F]/20"
            }`}
            onClick={() => console.log("Añadir al carrito: " + product.title + " Variant: " + selectedVariant?.id)}
          >
            <ShoppingCart className="w-6 h-6" />
            {isOutOfStock ? "Agotado" : "Agregar al carrito"}
          </button>
        </div>

        {/* FAQs / Accordion Section - Full width */}
        <div className="flex flex-col gap-4 mt-8 w-full">
          <h3 className="text-[#1E1E1E] font-sans font-normal text-xl leading-[1.2]">
            Preguntas Frecuentes
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sizing" className="border-none">
              <AccordionTrigger className="text-[#1E1E1E] font-sans font-medium text-lg hover:no-underline py-4 px-6 bg-[#F5F5F5] rounded-t-[12px]">
                ¿Cómo se que talla comprar?
              </AccordionTrigger>
              <AccordionContent className="text-[#757575] font-sans font-normal text-base leading-[1.6] px-6 pb-6 bg-[#F5F5F5] rounded-b-[12px]">
                La talla depende del tamaño de tu perro y de las medidas indicadas en nuestra tabla de medidas, por eso te recomendamos acceder al video para aprender cómo medirlo correctamente y elegir la talla ideal. 🐾📏
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
