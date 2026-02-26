"use client";

import * as React from "react";
import Image from "next/image";
import { ShopifyProduct, isMenudeoVariant, getMenudeoPriceRange } from "@/lib/shopify";
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus } from "lucide-react";
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
  const [quantity, setQuantity] = React.useState(0);
  
  // Extract unique sizes from Menudeo variants
  const sizes = Array.from(new Set(
    product.variants?.edges?.map(edge => {
      if (!isMenudeoVariant(edge.node)) return null;

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

  // Find the selected Menudeo variant based on the selected size
  const selectedVariant = product.variants?.edges?.find(edge => 
    isMenudeoVariant(edge.node) && (
      edge.node.selectedOptions.some(opt => 
        ['size', 'talla', 'tamaño', 'tamaño de accesorio'].includes(opt.name.toLowerCase()) && 
        opt.value === selectedSize
      ) || (edge.node.selectedOptions.length === 1 && edge.node.selectedOptions[0].value === selectedSize)
    )
  )?.node;

  const menudeoPriceRange = getMenudeoPriceRange(product);
  const minPrice = menudeoPriceRange.minVariantPrice;
  const maxPrice = menudeoPriceRange.maxVariantPrice;
  
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

  // Inventory logic: Use quantityAvailable if present, else fall back to availableForSale boolean
  const currentAvailability = selectedSize 
    ? (selectedVariant ? selectedVariant.quantityAvailable : 0)
    : (product.variants.edges[0]?.node?.quantityAvailable || 0);

  const isOutOfStock = selectedSize 
    ? (selectedVariant ? !selectedVariant.availableForSale || selectedVariant.quantityAvailable <= 0 : true)
    : !product.availableForSale || product.variants.edges.every(edge => edge.node.quantityAvailable <= 0);

  const incrementQuantity = () => {
    if (quantity < currentAvailability) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  // Reset quantity when size changes
  React.useEffect(() => {
    setQuantity(0);
  }, [selectedSize]);

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
          <h1 className="text-[#1E1E1E] font-sans font-semibold text-4xl leading-[1.2]">
            {product.title}
          </h1>
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

        {/* Interaction Section */}
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-4 gap-4 items-end w-full">
            {/* Talla Select (3/4) */}
            {sizes.length > 0 && (
              <div className="col-span-3 flex flex-col gap-3">
                <Label htmlFor="size-select-page" className="text-[#1E1E1E] font-sans font-medium text-lg h-7 flex items-center">Talla</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger id="size-select-page" className="w-full !h-14 rounded-[12px] border border-input text-lg flex items-center bg-white px-4">
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

            {/* Cantidad Select (1/4) */}
            <div className={`${sizes.length > 0 ? 'col-span-1' : 'col-span-4'} flex flex-col gap-3`}>
              <Label className="text-[#1E1E1E] font-sans font-medium text-lg h-7 flex items-center">Cantidad</Label>
              <div className="flex items-center justify-between w-full h-14 px-4 rounded-[12px] border border-input bg-white">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 0}
                  className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity >= currentAvailability || (sizes.length > 0 && !selectedSize)}
                  className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full">
            {isOutOfStock ? (
              <button 
                disabled
                className="flex items-center justify-center w-full text-white h-16 rounded-[12px] font-bold text-xl bg-gray-500 cursor-not-allowed"
              >
                Agotado
              </button>
            ) : (
              <div className="flex flex-row gap-4 w-full">
                {/* Add to Cart Button */}
                <button 
                  disabled={quantity === 0 || (sizes.length > 0 && !selectedSize)}
                  className={`flex items-center justify-center gap-3 flex-1 text-white h-16 rounded-[12px] font-bold text-xl transition-all ${
                    (quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF9230] hover:bg-[#e6832b] shadow-xl shadow-[#FF9230]/20"
                  }`}
                  onClick={() => console.log("Añadir al carrito: " + product.title + " Variant: " + selectedVariant?.id + " Cantidad: " + quantity)}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Agregar al carrito
                </button>
                {/* Comprar ahora Button */}
                <button 
                  disabled={quantity === 0 || (sizes.length > 0 && !selectedSize)}
                  className={`flex items-center justify-center flex-1 text-white h-16 rounded-[12px] font-bold text-xl transition-all ${
                    (quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#8CC63F] hover:bg-[#7ab236] shadow-xl shadow-[#8CC63F]/20"
                  }`}
                  onClick={() => console.log("Comprar ahora: " + product.title + " Variant: " + selectedVariant?.id + " Cantidad: " + quantity)}
                >
                  Comprar ahora
                </button>
              </div>
            )}
          </div>
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
