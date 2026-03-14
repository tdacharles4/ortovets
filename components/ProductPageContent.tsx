"use client";

import * as React from "react";
import Image from "next/image";
import Link from 'next/link';
import { ShopifyProduct, isMenudeoVariant, getMenudeoPriceRange } from "@/lib/shopify";
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Maximize2 } from "lucide-react";
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
import { ProductImageGallery } from "./ProductImageGallery";

export function ProductPageContent({ product }: { product: ShopifyProduct }) {
  const allImages = product.images?.edges?.map(edge => edge.node) || [];
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = React.useState(0);
  const [galleryApi, setGalleryApi] = React.useState<any>();

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
  const [selectedSide, setSelectedSide] = React.useState<string | undefined>(undefined);

  // Listado de lados disponibles
  const sideOptions = React.useMemo(()=>{
    if(!selectedSize)return[];
    const variantsForSize=product.variants.edges.filter(edge=>edge.node.selectedOptions.some(opt=>opt.name.toLowerCase()==='talla'&&opt.value===selectedSize));
    const sides = variantsForSize.map(edge=>edge.node.selectedOptions.find(opt=>opt.name.toLowerCase()==='lado')?.value);
    return[...new Set(sides.filter(Boolean))] as string[];
  },[selectedSize,product.variants.edges]);

  // Find the selected Menudeo variant based on the selected size
  const selectedVariant = React.useMemo(()=>{
    if(!selectedSize){
      return product.variants.edges.length===1?product.variants.edges[0].node:undefined;
    }
    const matchingVariant=product.variants.edges.find(edge=>{
      const hasSize=edge.node.selectedOptions.some(opt=>opt.name.toLowerCase()==='talla'&&opt.value===selectedSize);
      if(!hasSize)return false;
      if(sideOptions.length>0){
        return edge.node.selectedOptions.some(opt=>opt.name.toLowerCase()==='lado'&&opt.value===selectedSide);
      }return true;
    })?.node;
  },[selectedSize,selectedSide,product.variants.edges,sideOptions])

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
    setQuantity(1);
  }, [selectedSize]);

  // Abrir x imagen al abrir la galeria expansible
  React.useEffect(()=>{
    if(galleryApi&&isGalleryOpen){
      setTimeout(()=>{
        galleryApi.scrollTo(galleryInitialIndex, true);
      },10);
    }
  },[galleryApi,isGalleryOpen,galleryInitialIndex]);

  return (
    <section className="w-full flex flex-col lg:flex-row gap-8 lg:gap-[64px]">
      {/* Images Frame*/}
      <div className="flex flex-col w-full lg:w-[600px] xl:w-[816px] gap-[16px] lg:gap-[24px] shrink-0">
        {/* Main Image Container */}
        <div className="relative w-full aspect-square md:aspect-video lg:aspect-square lg:h-[800px] bg-muted overflow-hidden rounded-2xl">
          {mainImage ? (
            <button
              type="button"
              className="w-full h-full"
              onClick={() => {
                setGalleryInitialIndex(selectedImageIndex);
                setIsGalleryOpen(true);
              }}
            >
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/40 text-white p-1.5 rounded-lg pointer-events-none">
              <Maximize2 className="w-5 h-5" />
            </div>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted text-xl">
              Sin imagen
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="flex items-center w-full gap-2 justify-center">
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
          
          <div className="flex flex-row gap-2 lg:gap-[16px] overflow-hidden">
            {visibleImages.map((item, idx) => (
              <div 
                key={`${item.img.url}-${idx}`}
                onClick={() => setSelectedImageIndex(item.actualIndex)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[120px] xl:h-[120px] shrink-0 bg-muted rounded-lg lg:rounded-xl cursor-pointer border-2 transition-colors ${
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
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
        </div>
      </div>

      {/* Product Info Frame */}
      <div className="flex flex-col flex-grow gap-6 lg:gap-8 pt-2 lg:pt-4">
        {/* Title and Price Section */}
        <div className="flex flex-col gap-3 md:gap-4 w-full text-center lg:text-left">
          <h1 className="text-[#1E1E1E] font-sans font-semibold text-2xl md:text-3xl xl:text-4xl leading-[1.2]">
            {product.title}
          </h1>
          <p className="text-[#1E1E1E] font-sans font-bold text-xl md:text-2xl">
            {priceDisplay}
          </p>
        </div>

        {/* Description */}
        <div className="w-full text-center lg:text-left">
          <p className="text-[#757575] font-sans font-normal text-base md:text-lg leading-[1.6]">
            {product.description}
          </p>
        </div>

        {/* Interaction Section */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
            {/* Talla Select */}
            {sizes.length > 0 && (
              <div className="flex flex-col gap-3 w-full sm:flex-[3]">
                <Label htmlFor="size-select-page" className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">Talla</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger id="size-select-page" className="w-full !h-14 rounded-[12px] border border-input text-base md:text-lg flex items-center bg-white px-4">
                    <SelectValue placeholder="Selecciona una talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size!} className="text-base md:text-lg">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Lado Select */}
            {sideOptions.length>0&&(
              <div className="flex flex-col gap-2 w-full sm:flex-[3]">
                <Label htmlFor="size-select-page" className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">Lado</Label>
                <Select value={selectedSide} onValueChange={setSelectedSide}>
                  <SelectTrigger id="size-select-page" className="w-full !h-14 rounded-[12px] border border-input text-base md:text-lg flex items-center bg-white px-4">
                    <SelectValue placeholder="Selecciona un lado" />
                  </SelectTrigger>
                  <SelectContent>
                    {sideOptions.map((side) => (
                      <SelectItem key={side} value={side!}>
                        {side}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Cantidad Select */}
            <div className={`flex flex-col gap-3 w-full ${sizes.length > 0 ? 'sm:flex-[1]' : ''}`}>
              <Label className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">Cantidad</Label>
              <div className="flex items-center justify-between w-full h-14 px-4 rounded-[12px] border border-input bg-white">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 0}
                  className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-base md:text-lg font-medium">{quantity}</span>
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
                className="flex items-center justify-center w-full text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl bg-gray-500 cursor-not-allowed"
              >
                Agotado
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Add to Cart Button */}
                <button 
                  disabled={quantity === 0 || (sizes.length > 0 && !selectedSize)}
                  className={`flex items-center justify-center gap-3 flex-1 text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl transition-all ${
                    (quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF9230] hover:bg-[#e6832b] shadow-xl shadow-[#FF9230]/20"
                  }`}
                  onClick={() => console.log("Añadir al carrito: " + product.title + " Variant: " + selectedVariant?.id + " Cantidad: " + quantity)}
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="whitespace-nowrap">Agregar al carrito</span>
                </button>
                {/* Comprar ahora Button */}
                <button 
                  disabled={quantity === 0 || (sizes.length > 0 && !selectedSize)}
                  className={`flex items-center justify-center flex-1 text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl transition-all ${
                    (quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#8CC63F] hover:bg-[#7ab336] shadow-xl shadow-[#8CC63F]/20"
                  }`}
                  onClick={() => console.log("Comprar ahora: " + product.title + " Variant: " + selectedVariant?.id + " Cantidad: " + quantity)}
                >
                  <span className="whitespace-nowrap">Comprar ahora</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQs / Accordion Section */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-8 w-full">
          <h3 className="text-[#1E1E1E] font-sans font-normal text-lg md:text-xl leading-[1.2] text-center lg:text-left">
            Preguntas Frecuentes
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sizing" className="border-none">
              <AccordionTrigger className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg hover:no-underline py-3 md:py-4 px-4 md:px-6 bg-[#F5F5F5] rounded-t-[12px]">
                ¿Cómo se que talla comprar?
              </AccordionTrigger>
              <AccordionContent className="text-[#757575] font-sans font-normal text-sm md:text-base leading-[1.6] px-4 md:px-6 pb-4 md:pb-6 bg-[#F5F5F5] rounded-b-[12px]">
                La talla depende del tamaño de tu perro y de las medidas indicadas en nuestra tabla de medidas, por eso te recomendamos{" "} 
                <a 
                  href={`/tienda/${product.handle}#video-section`} 
                  className="text-[#1E1E1E] underline underline-offset-4 font-medium hover:text-black transition-colors cursor-pointer"
                >
                  acceder al video
                </a> 
                {" "}para aprender cómo medirlo correctamente y elegir la talla ideal. 🐾📏
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <ProductImageGallery images={allImages} isOpen={isGalleryOpen} onOpenChange={setIsGalleryOpen} initialIndex={galleryInitialIndex}/>
    </section>
  );
}
