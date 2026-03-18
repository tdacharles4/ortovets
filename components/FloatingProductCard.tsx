"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import InnerImageZoom from "react-inner-image-zoom";
import 'react-inner-image-zoom/lib/styles.min.css';
import { ShopifyProduct, isMenudeoVariant, getMenudeoPriceRange } from "@/lib/shopify";
import { X, ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Maximize2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { useCart } from "@/app/context/cartContext";
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
import { toast } from "sonner";
import { ProductImageGallery } from "./ProductImageGallery";


export function FloatingProductCard({ product }: { product: ShopifyProduct }) {
  const allImages = product.images?.edges?.map(edge => edge.node) || [];
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = React.useState(0);

  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = React.useState(0);
  const [galleryApi, setGalleryApi] = React.useState<any>();

  // cart
  const { addToCart } = useCart();

  const [quantity, setQuantity] = React.useState(1);
  const [buyNowLoading, setBuyNowLoading] = React.useState(false);

  const handleAddToCart = () => {
    if (!product) return;

    const hasVariants = sizes.length > 1;

    if (!selectedSize && hasVariants) {
      toast("Debes seleccionar una talla");
      return;
    }

    const variant = selectedVariant || product.variants?.edges?.[0]?.node;
    if (!variant) {
      toast("No se encontraron variantes de este producto");
      return;
    }

    if (!variant.availableForSale) {
      toast("Este producto está agotado.");
      return;
    }

    const availableQty = variant.quantityAvailable ?? 0;
    if (availableQty === 0) {
      toast("Este producto no está disponible.");
      return;
    }

    const finalQty = Math.min(quantity, availableQty);
    if (quantity > availableQty) {
      toast(`Solo hay ${availableQty} disponibles — se agregó la cantidad máxima.`);
    }

    addToCart({
      id: variant.id,
      title: product.title,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      quantity: finalQty,
      image: product.images.edges[0]?.node.url,
      available: availableQty,
    });
  };

  const handleBuyNow = async () => {
    const hasVariants = sizes.length > 1;
    if (!selectedSize && hasVariants) {
      toast("Debes seleccionar una talla");
      return;
    }
    const variant = selectedVariant || product.variants?.edges?.[0]?.node;
    if (!variant) return;
    if (!variant.availableForSale) {
      toast("Este producto está agotado.");
      return;
    }
    const availableQty = variant.quantityAvailable ?? Infinity;
    const finalQty = Math.min(quantity, availableQty);
    setBuyNowLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: variant.id, quantity: finalQty, price: parseFloat(variant.price.amount), title: product.title, variantTitle: variant.title, image: product.images.edges[0]?.node.url }],
        }),
      });
      const { webUrl } = await res.json();
      if (webUrl) {
        window.location.href = webUrl;
      } else {
        toast("No se pudo iniciar el checkout. Intenta de nuevo.");
      }
    } catch {
      toast("Error al procesar el checkout.");
    } finally {
      setBuyNowLoading(false);
    }
  };

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
      const options=edge.node.selectedOptions;
      const sizeOpt=options.find(opt=>['size','talla','tamaño','tamaño de accesorio'].includes(opt.name.toLowerCase()));
      const sizeValue=sizeOpt?.value??(options.length===1&&options[0].name!=='Title'?options[0].value:undefined);
      const hasSize=sizeValue===selectedSize;
      if(!hasSize)return false;
      if(sideOptions.length>0){
        return options.some(opt=>opt.name.toLowerCase()==='lado'&&opt.value===selectedSide);
      }return true;
    })?.node;
    return matchingVariant;
  },[selectedSize,selectedSide,product.variants.edges,sideOptions])

  const menudeoPriceRange = getMenudeoPriceRange(product);
  const minPrice = menudeoPriceRange.minVariantPrice;
  const maxPrice = menudeoPriceRange.maxVariantPrice;

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

  // Get visible images with wrap-around logic
  const visibleImages = [];
  if (allImages.length > 0) {
    const count = Math.min(allImages.length, 3);
    for (let i = 0; i < count; i++) {
      const index = (carouselStartIndex + i) % allImages.length;
      if (allImages[index]) {
        visibleImages.push({ img: allImages[index], actualIndex: index });
      }
    }
  }

  // Inventory logic: null quantityAvailable means Shopify isn't tracking inventory — treat as unlimited, rely on availableForSale only
  const currentAvailability = selectedSize
    ? (selectedVariant ? (selectedVariant.quantityAvailable ?? Infinity) : 0)
    : (product.variants.edges[0]?.node?.quantityAvailable ?? Infinity);

  const isOutOfStock = selectedSize
    ? (selectedVariant ? !selectedVariant.availableForSale || (selectedVariant.quantityAvailable != null && selectedVariant.quantityAvailable <= 0) : true)
    : !product.availableForSale && product.variants.edges.every(edge => edge.node.quantityAvailable != null && edge.node.quantityAvailable <= 0);

  const incrementQuantity = () => {
    if (quantity < currentAvailability) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
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
    <div className="relative flex flex-col lg:flex-row w-full max-w-[95vw] lg:w-fit h-fit max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible bg-[#FFFFFF] rounded-[24px] lg:rounded-[32px] items-center lg:items-start p-6 md:p-10 lg:p-[64px] gap-8 lg:gap-[24px] group/fpc shadow-2xl mx-auto">
      {/* Close Button Inside the card */}
      <DialogClose className="absolute top-4 right-4 lg:top-8 lg:right-8 p-2 rounded-full hover:bg-muted transition-colors z-50">
        <X className="w-5 h-5 lg:w-6 lg:h-6 text-[#1E1E1E]" />
        <span className="sr-only">Cerrar</span>
      </DialogClose>

      {/* FPC Image Frame */}
      <div className="flex flex-col w-full sm:w-[400px] lg:w-[352px] gap-6 lg:gap-[24px] shrink-0 items-center">
        {/* Main Image */}
        <div className="relative w-full aspect-square lg:h-[345px] shrink-0 rounded-[20px] lg:rounded-[24px] overflow-hidden bg-muted">
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
              className="object-cover transition-transform duration-500 lg:group-hover/fpc:scale-110"
            />
            <div className="absolute bottom-3 right-3 bg-black/40 text-white p-1.5 rounded-lg pointer-events-none">
              <Maximize2 className="w-5 h-5" />
            </div>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground bg-muted">
              Sin imagen
            </div>
          )}
        </div>

        {/* Extra Images Carousel Frame */}
        <div className="flex items-center w-full gap-2 justify-center">
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          
          <div className="flex flex-row gap-2 lg:gap-[10px] overflow-hidden">
            {visibleImages.map((item, idx) => (
              <div 
                key={`${item.img.url}-${idx}`}
                onClick={() => setSelectedImageIndex(item.actualIndex)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] shrink-0 rounded-[12px] overflow-hidden cursor-pointer border-2 transition-colors ${
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
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Hyperlink text */}
        <div className="flex justify-center w-full mt-2 lg:mt-0">
          <DialogClose asChild>
            <Link 
              href={`/tienda/${product.handle || ""}`}
              className="text-[#0091FF] font-sans font-normal text-sm lg:text-base leading-[1.4] underline decoration-solid w-fit"
            >
              Ver más detalles
            </Link>
          </DialogClose>
        </div>
      </div>

      {/* FPC Product Info Frame */}
      <div className="flex flex-col w-full lg:w-[450px] xl:w-[500px] h-fit min-h-0 lg:min-h-[453px] justify-between shrink-0">
        <div className="flex flex-col w-full gap-6">
          {/* Title Frame */}
          <div className="flex flex-col w-full gap-[4px] text-center lg:text-left">
            {/* Product Name */}
            <h3 className="text-[#1E1E1E] font-sans font-semibold text-lg lg:text-xl leading-[1.2]">
              {product.title}
            </h3>
            {/* Product Price */}
            <p className="text-[#1E1E1E] font-sans font-bold text-xl lg:text-xl leading-[1.0]">
              {priceDisplay}
            </p>
          </div>

          {/* Text Frame */}
          <div className="w-full text-center lg:text-left">
            <p className="text-[#757575] font-sans font-normal text-sm lg:text-base leading-[1.4] line-clamp-[4]">
              {product.description}
            </p>
          </div>

          {/* Interaction Section */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
              {/* Talla Select */}
              {sizes.length > 0 && (
                <div className="flex flex-col gap-2 w-full sm:flex-[3]">
                  <Label htmlFor="size-select-fpc" className="text-[#1E1E1E] font-sans font-medium text-sm h-5 flex items-center">Talla</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger id="size-select-fpc" className="w-full !h-12 rounded-[8px] border border-input text-base flex items-center bg-white px-3">
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

              {/* Lado Select */}
              {sideOptions.length>0&&(
                <div className="flex flex-col gap-2 w-full sm:flex-[3]">
                  <Label htmlFor="size-select-fpc" className="text-[#1E1E1E] font-sans font-medium text-sm h-5 flex items-center">Lado</Label>
                  <Select value={selectedSide} onValueChange={setSelectedSide}>
                    <SelectTrigger id="size-select-fpc" className="w-full !h-12 rounded-[8px] border border-input text-base flex items-center bg-white px-3">
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
              <div className={`flex flex-col gap-2 w-full ${sizes.length > 0 ? 'sm:flex-[1]' : ''}`}>
                <Label className="text-[#1E1E1E] font-sans font-medium text-sm h-5 flex items-center">Cantidad</Label>
                <div className="flex items-center justify-between w-full h-12 px-3 rounded-[8px] border border-input bg-white">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-medium">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= currentAvailability || (sizes.length > 0 && !selectedSize)}
                    className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {isOutOfStock ? (
                <button 
                  disabled
                  className="flex items-center justify-center w-full text-white h-12 rounded-[8px] font-bold text-lg bg-gray-500 cursor-not-allowed"
                >
                  Agotado
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {/* Add to Cart Button */}
                  <button 
                    disabled={quantity === 0 || (sizes.length > 0 && !selectedSize)}
                    className={`flex items-center justify-center gap-2 flex-1 text-white h-12 rounded-[8px] font-bold text-base lg:text-lg transition-all ${
                      (quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF9230] hover:bg-[#e6832b] shadow-lg shadow-[#FF9230]/20"
                    }`}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="whitespace-nowrap">Agregar al carrito</span>
                  </button>
                  {/* Comprar ahora Button CHECKOUT*/}
                  <button
                    disabled={buyNowLoading || quantity === 0 || (sizes.length > 0 && !selectedSize)}
                    className={`flex items-center justify-center flex-1 text-white h-12 rounded-[8px] font-bold text-base lg:text-lg transition-all ${
                      (buyNowLoading || quantity === 0 || (sizes.length > 0 && !selectedSize)) ? "bg-gray-300 cursor-not-allowed" : "bg-[#8CC63F] hover:bg-[#7ab336] shadow-lg shadow-[#8CC63F]/20"
                    }`}
                    onClick={handleBuyNow}
                  >
                    <span className="whitespace-nowrap">{buyNowLoading ? "Cargando..." : "Comprar ahora"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sizing" className="border-none">
              <AccordionTrigger className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg hover:no-underline py-3 md:py-4 px-4 md:px-6 bg-[#F5F5F5] rounded-t-[12px] flex items-center justify-between leading-none">
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

      {/* 2.2. Componente HTML de la Galeria Expansible */}
      <ProductImageGallery images={allImages} isOpen={isGalleryOpen} onOpenChange={setIsGalleryOpen} initialIndex={galleryInitialIndex}/>
    </div>
  );
}
