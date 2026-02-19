"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/shopify";
import { X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
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

export function FloatingProductCard({ product }: { product: ShopifyProduct }) {
  const allImages = product.images?.edges?.map(edge => edge.node) || [];
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = React.useState(0);
  
  // Extract unique sizes from variants with more robust detection
  const sizes = Array.from(new Set(
    product.variants?.edges?.map(edge => {
      const options = edge.node.selectedOptions;
      // Look for common size-related names
      const sizeOpt = options.find(opt => 
        ['size', 'talla', 'tamaño', 'tamaño de accesorio'].includes(opt.name.toLowerCase())
      );
      // Fallback: if there's only one option and it's not "Title", use it
      if (!sizeOpt && options.length === 1 && options[0].name !== 'Title') {
        return options[0].value;
      }
      return sizeOpt?.value;
    }).filter(Boolean) || []
  )) as string[];

  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(undefined);

  // Find the selected variant based on the selected size
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

  // Determine what price to display
  let priceDisplay = "";
  if (selectedSize && selectedVariant) {
    priceDisplay = formatPrice(selectedVariant.price);
  } else if (minPrice.amount === maxPrice.amount) {
    priceDisplay = formatPrice(minPrice);
  } else {
    priceDisplay = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  }

  const mainImage = allImages[selectedImageIndex] || allImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length === 0) return;
    setCarouselStartIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length === 0) return;
    setCarouselStartIndex(prev => (prev + 1) % allImages.length);
  };

  // Get 3 visible images with wrap-around logic
  const visibleImages = [];
  if (allImages.length > 0) {
    for (let i = 0; i < 3; i++) {
      const index = (carouselStartIndex + i) % allImages.length;
      if (allImages[index]) {
        visibleImages.push({ img: allImages[index], actualIndex: index });
      }
    }
  }

  return (
    <div className="relative flex flex-row w-fit h-fit bg-[#FFFFFF] rounded-[32px] overflow-hidden items-center p-[64px] gap-[24px] group/fpc shadow-2xl">
      {/* Close Button Inside the card */}
      <DialogClose className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted transition-colors z-50">
        <X className="w-6 h-6 text-[#1E1E1E]" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>

      {/* FPC Image Frame - 352w vertical 24px gap */}
      <div className="flex flex-col w-[352px] gap-[24px] shrink-0 items-center">
        {/* Main Image - 352w 345h fixed */}
        <div className="relative w-[352px] h-[345px] shrink-0 rounded-[24px] overflow-hidden bg-muted">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover/fpc:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground bg-muted">
              Sin imagen
            </div>
          )}
        </div>

        {/* Extra Images Carousel Frame - 352w 84h horizontal gap-2 */}
        <div className="flex items-center w-[352px] gap-2">
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-row w-[272px] h-[84px] gap-[10px] overflow-hidden">
            {visibleImages.map((item, idx) => (
              <div 
                key={`${item.img.url}-${idx}`}
                onClick={() => setSelectedImageIndex(item.actualIndex)}
                className={`relative w-[84px] h-[84px] shrink-0 rounded-[12px] overflow-hidden cursor-pointer border-2 transition-colors ${
                  selectedImageIndex === item.actualIndex ? "border-[#8CC63F]" : "border-transparent hover:border-muted"
                }`}
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
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Hyperlink text - Body Link Medium Regular 140% underlined #0091FF - Centered */}
        <div className="flex justify-center w-full">
          <DialogClose asChild>
            <Link 
              href={`/tienda/${product.handle || ""}`}
              className="text-[#0091FF] font-sans font-normal text-base leading-[1.4] underline decoration-solid w-fit"
            >
              Ver más detalles
            </Link>
          </DialogClose>
        </div>
      </div>

      {/* FPC Product Info Frame - 500w 453h fixed vertical justify space-between */}
      <div className="flex flex-col w-[500px] h-fit min-h-[453px] justify-between shrink-0">
        <div className="flex flex-col w-full gap-4">
          {/* Title Frame - 500w hug vertical gap 4px */}
          <div className="flex flex-col w-full gap-[4px]">
            {/* Product Name - Heading SemiBold Base 120% #1E1E1E */}
            <h3 className="text-[#1E1E1E] font-sans font-semibold text-xl leading-[1.2]">
              {product.title}
            </h3>
            {/* Product Price - Title Page Bold Base 100% #1E1E1E */}
            <p className="text-[#1E1E1E] font-sans font-bold text-xl leading-[1.0]">
              {priceDisplay}
            </p>
          </div>

          {/* Text Frame - [productdescription] Body Base Regular Medium 140% #757575 */}
          <div className="w-full">
            <p className="text-[#757575] font-sans font-normal text-base leading-[1.4] line-clamp-[6]">
              {product.description}
            </p>
          </div>

          {/* Talla Select Frame */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="size-select" className="text-[#1E1E1E] font-sans font-medium text-sm">Talla</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size-select" className="w-full h-12 rounded-[8px] border-input">
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size!}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Agregar al carrito Button */}
          <button 
            className="flex items-center justify-center gap-[8px] w-full bg-[#8CC63F] text-white p-[12px] rounded-[8px] font-bold text-lg hover:bg-[#7ab236] transition-colors shadow-lg shadow-[#8CC63F]/20 mt-2 cursor-pointer"
            onClick={() => console.log("Añadir al carrito: " + product.title + " Variant: " + selectedVariant?.id)}
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar al carrito
          </button>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sizing" className="border-none">
              <AccordionTrigger className="text-[#1E1E1E] font-sans font-medium text-base hover:no-underline py-2">
                ¿Cómo se que talla comprar?
              </AccordionTrigger>
              <AccordionContent className="text-[#757575] font-sans font-normal text-sm leading-[1.4]">
                La talla depende del tamaño de tu perro y de las medidas indicadas en nuestra tabla de medidas, por eso te recomendamos acceder al video para aprender cómo medirlo correctamente y elegir la talla ideal. 🐾📏
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
