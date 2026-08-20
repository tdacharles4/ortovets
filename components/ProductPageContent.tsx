"use client";

import * as React from "react";
import Image from "next/image";
import Link from 'next/link';
import { ShopifyProduct, isMenudeoVariant, getMenudeoPriceRange, getMVZDiscount } from "@/lib/shopify";
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Maximize2, Tag } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/app/context/cartContext";
import { toast } from "sonner";
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
  const [buyNowLoading, setBuyNowLoading] = React.useState(false);
  const imagesFrameRef = React.useRef<HTMLDivElement>(null);
  const infoFrameRef = React.useRef<HTMLDivElement>(null);
  const infoInnerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const images = imagesFrameRef.current;
    const outer = infoFrameRef.current;
    const inner = infoInnerRef.current;
    if (!images || !outer || !inner) return;

    const update = () => {
      if (window.innerWidth < 1280) {
        outer.style.height = "";
        inner.style.transform = "";
        inner.style.transformOrigin = "";
        return;
      }
      const imagesHeight = images.offsetHeight;
      if (!imagesHeight) return;
      outer.style.height = `${imagesHeight}px`;
      // Reset transform before measuring natural height
      inner.style.transform = "";
      inner.style.transformOrigin = "";
      void inner.getBoundingClientRect();
      const naturalHeight = inner.scrollHeight;
      if (naturalHeight > imagesHeight) {
        const scale = imagesHeight / naturalHeight;
        inner.style.transformOrigin = "top center";
        inner.style.transform = `scale(${scale})`;
      }
    };

    const observer = new ResizeObserver(update);
    observer.observe(images);
    observer.observe(inner);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // cart
  const { addToCart } = useCart();

  // MVZ discount
  const { customer } = useCustomer();
  const isMVZ = customer?.tags?.includes('MVZ') ?? false;
  const mvzDiscountPercent = getMVZDiscount(product);

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

  const SIZE_OPTION_NAMES = ['size', 'talla', 'tamaño', 'tamaño de accesorio'];

  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(undefined);
  const [selectedSecondOption, setSelectedSecondOption] = React.useState<string | undefined>(undefined);

  // Detect any second option beyond size (e.g. Lado, Mangas, etc.)
  const secondOption = React.useMemo(() => {
    if (!selectedSize) return { name: null, values: [] as string[] };

    const variantsForSize = product.variants.edges.filter(edge =>
      edge.node.selectedOptions.some(opt =>
        SIZE_OPTION_NAMES.includes(opt.name.toLowerCase()) && opt.value === selectedSize
      )
    );

    let optionName: string | null = null;
    const values: string[] = [];

    for (const edge of variantsForSize) {
      const extraOpt = edge.node.selectedOptions.find(opt =>
        !SIZE_OPTION_NAMES.includes(opt.name.toLowerCase()) && opt.name !== 'Title'
      );
      if (extraOpt) {
        if (!optionName) optionName = extraOpt.name;
        if (!values.includes(extraOpt.value)) values.push(extraOpt.value);
      }
    }

    return { name: optionName, values };
  }, [selectedSize, product.variants.edges]);

  // Find the selected Menudeo variant based on size + optional second option
  const selectedVariant = React.useMemo(() => {
    if (!selectedSize) {
      return product.variants.edges.length === 1 ? product.variants.edges[0].node : undefined;
    }
    return product.variants.edges.find(edge => {
      const options = edge.node.selectedOptions;
      const sizeOpt = options.find(opt => SIZE_OPTION_NAMES.includes(opt.name.toLowerCase()));
      const sizeValue = sizeOpt?.value ?? (options.length === 1 && options[0].name !== 'Title' ? options[0].value : undefined);
      if (sizeValue !== selectedSize) return false;

      if (secondOption.values.length > 0) {
        return options.some(opt =>
          !SIZE_OPTION_NAMES.includes(opt.name.toLowerCase()) &&
          opt.name !== 'Title' &&
          opt.value === selectedSecondOption
        );
      }
      return true;
    })?.node;
  }, [selectedSize, selectedSecondOption, product.variants.edges, secondOption])

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

  // MVZ discount display
  const showMVZDiscount = isMVZ && mvzDiscountPercent !== null && selectedVariant !== undefined;
  const discountedPrice = showMVZDiscount
    ? formatPrice({
        amount: (parseFloat(selectedVariant!.price.amount) * (1 - mvzDiscountPercent! / 100)).toFixed(2),
        currencyCode: selectedVariant!.price.currencyCode,
      })
    : null;
  const originalPriceFormatted = showMVZDiscount ? formatPrice(selectedVariant!.price) : null;

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

  // Inventory logic: null quantityAvailable means Shopify isn't tracking inventory — treat as unlimited, rely on availableForSale only
  const currentAvailability = selectedSize
    ? (selectedVariant ? (selectedVariant.quantityAvailable ?? Infinity) : 0)
    : (product.variants.edges[0]?.node?.quantityAvailable ?? Infinity);

  const pendingSelection = secondOption.values.length > 0 && !selectedSecondOption;

  const isOutOfStock = selectedSize
    ? (selectedVariant ? !selectedVariant.availableForSale || (selectedVariant.quantityAvailable != null && selectedVariant.quantityAvailable <= 0) : !pendingSelection)
    : !product.availableForSale && product.variants.edges.every(edge => edge.node.quantityAvailable != null && edge.node.quantityAvailable <= 0);

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

  const handleAddToCart = () => {
    const hasVariants = sizes.length > 1;
    if (!selectedSize && hasVariants) {
      toast("Debes seleccionar una talla");
      return;
    }
    if (pendingSelection) {
      toast(`Debes seleccionar ${secondOption.name?.toLowerCase()}`);
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
      mvzDiscount: isMVZ && mvzDiscountPercent ? mvzDiscountPercent : undefined,
    });
  };

  const handleBuyNow = async () => {
    const hasVariants = sizes.length > 1;
    if (!selectedSize && hasVariants) return;
    if (pendingSelection) return;
    const variant = selectedVariant || product.variants?.edges?.[0]?.node;
    if (!variant || !variant.availableForSale) return;
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
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setBuyNowLoading(false);
    }
  };

  // Abrir x imagen al abrir la galeria expansible
  React.useEffect(()=>{
    if(galleryApi&&isGalleryOpen){
      setTimeout(()=>{
        galleryApi.scrollTo(galleryInitialIndex, true);
      },10);
    }
  },[galleryApi,isGalleryOpen,galleryInitialIndex]);

  const selectorsAndButtons = (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
        {sizes.length > 0 && (
          <div className="flex flex-col gap-3 w-full sm:flex-[3]">
            <Label htmlFor="size-select-page" className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">Talla</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger id="size-select-page" className="w-full !h-14 rounded-[12px] border border-input text-base md:text-lg flex items-center bg-white px-4">
                <SelectValue placeholder="Selecciona una talla" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size!} className="text-base md:text-lg">{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {secondOption.values.length > 0 && (
          <div className="flex flex-col gap-2 w-full sm:flex-[3]">
            <Label htmlFor="second-option-select-page" className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">{secondOption.name}</Label>
            <Select value={selectedSecondOption} onValueChange={setSelectedSecondOption}>
              <SelectTrigger id="second-option-select-page" className="w-full !h-14 rounded-[12px] border border-input text-base md:text-lg flex items-center bg-white px-4">
                <SelectValue placeholder={`Selecciona ${secondOption.name?.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {secondOption.values.map((val) => (
                  <SelectItem key={val} value={val}>{val}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className={`flex flex-col gap-3 w-full ${sizes.length > 0 ? 'sm:flex-[1]' : ''}`}>
          <Label className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg h-7 flex items-center">Cantidad</Label>
          <div className="flex items-center justify-between w-full h-14 px-4 rounded-[12px] border border-input bg-white">
            <button onClick={decrementQuantity} disabled={quantity <= 0} className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-base md:text-lg font-medium">{quantity}</span>
            <button onClick={incrementQuantity} disabled={quantity >= currentAvailability || (sizes.length > 0 && (!selectedSize || pendingSelection))} className="p-1 hover:text-[#8CC63F] disabled:text-gray-300 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {isOutOfStock ? (
          <button disabled className="flex items-center justify-center w-full text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl bg-gray-500 cursor-not-allowed">
            Agotado
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              disabled={quantity === 0 || (sizes.length > 0 && (!selectedSize || pendingSelection))}
              className={`flex items-center justify-center gap-3 flex-1 text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl transition-all ${(quantity === 0 || (sizes.length > 0 && (!selectedSize || pendingSelection))) ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF9230] hover:bg-[#e6832b] shadow-xl shadow-[#FF9230]/20"}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span className="whitespace-nowrap">Agregar al carrito</span>
            </button>
            <button
              disabled={buyNowLoading || quantity === 0 || (sizes.length > 0 && (!selectedSize || pendingSelection))}
              className={`flex items-center justify-center flex-1 text-white h-14 md:h-16 rounded-[12px] font-bold text-lg md:text-xl transition-all ${(buyNowLoading || quantity === 0 || (sizes.length > 0 && (!selectedSize || pendingSelection))) ? "bg-gray-300 cursor-not-allowed" : "bg-[#8CC63F] hover:bg-[#7ab336] shadow-xl shadow-[#8CC63F]/20"}`}
              onClick={handleBuyNow}
            >
              <span className="whitespace-nowrap">{buyNowLoading ? "Cargando..." : "Comprar ahora"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  const faqsContent = (
    <>
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
            <a href={`/tienda/${product.handle}#video-section`} className="text-[#1E1E1E] underline underline-offset-4 font-medium hover:text-black transition-colors cursor-pointer">
              acceder al video
            </a>
            {" "}para aprender cómo medirlo correctamente y elegir la talla ideal. 🐾📏
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="placing" className="border-none">
          <AccordionTrigger className="text-[#1E1E1E] font-sans font-medium text-base md:text-lg hover:no-underline py-3 md:py-4 px-4 md:px-6 bg-[#F5F5F5] rounded-t-[12px] flex items-center justify-between leading-none">
            ¿Cómo colocar el producto a mi mascota?
          </AccordionTrigger>
          <AccordionContent className="text-[#757575] font-sans font-normal text-sm md:text-base leading-[1.6] px-4 md:px-6 pb-4 md:pb-6 bg-[#F5F5F5] rounded-b-[12px]">
            Aqui va el contenido del colapsable.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );

  return (
    <section className="w-full flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 xl:flex xl:flex-row xl:gap-[64px]">
      {/* Mobile-only title above image */}
      <h1 className="block md:hidden text-[#1E1E1E] font-sans font-semibold text-xl leading-[1.2] text-center">
        {product.title}
      </h1>

      {/* Images Frame */}
      <div ref={imagesFrameRef} className="flex flex-col w-[60%] mx-auto md:w-full md:mx-0 md:col-start-1 md:row-start-1 xl:w-[816px] gap-[16px] xl:gap-[24px] xl:min-w-[280px]">
        {/* Main Image Container */}
        <div className="relative w-full aspect-square md:aspect-video xl:aspect-square bg-muted overflow-hidden rounded-2xl">
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

        {/* Mobile carousel — swipeable, no buttons */}
        <div className="flex xl:hidden flex-row gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {allImages.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-muted rounded-lg cursor-pointer border-2 transition-colors snap-start ${
                selectedImageIndex === index ? "border-[#8CC63F]" : "border-transparent hover:border-muted"
              }`}
            >
              <Image src={img.url} alt={img.altText || `Thumbnail ${index}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* Desktop carousel — windowed with prev/next buttons */}
        <div className="hidden xl:flex items-center w-full gap-2 justify-center">
          <button onClick={handlePrev} className="p-1 hover:bg-muted rounded-full transition-colors shrink-0">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="flex flex-row gap-[16px] overflow-hidden">
            {visibleImages.map((item, idx) => (
              <div
                key={`${item.img.url}-${idx}`}
                onClick={() => setSelectedImageIndex(item.actualIndex)}
                className={`relative w-28 h-28 xl:w-[120px] xl:h-[120px] shrink-0 bg-muted rounded-xl cursor-pointer border-2 transition-colors ${
                  selectedImageIndex === item.actualIndex ? "border-[#8CC63F]" : "border-transparent hover:border-muted"
                }`}
              >
                <Image src={item.img.url} alt={item.img.altText || `Thumbnail ${item.actualIndex}`} fill className="object-cover" />
              </div>
            ))}
          </div>
          <button onClick={handleNext} className="p-1 hover:bg-muted rounded-full transition-colors shrink-0">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Product Info Frame */}
      <div ref={infoFrameRef} className="flex flex-col flex-grow md:col-start-2 md:row-start-1 xl:max-w-[65%] xl:overflow-hidden">
        <div ref={infoInnerRef} className="flex flex-col gap-6 lg:gap-8 pt-2 lg:pt-4">
        {/* Title and Price Section */}
        <div className="flex flex-col gap-3 md:gap-4 w-full text-center lg:text-left">
          <h1 className="hidden md:block text-[#1E1E1E] font-sans font-semibold text-2xl md:text-3xl xl:text-4xl leading-[1.2]">
            {product.title}
          </h1>
          {showMVZDiscount ? (
            <div className="flex items-center gap-3">
              <div className="relative inline-block pt-5">
                <span className="absolute top-0 right-0 text-sm text-gray-400 line-through whitespace-nowrap">
                  {originalPriceFormatted}
                </span>
                <p className="text-[#1E1E1E] font-sans font-bold text-xl md:text-2xl leading-none">
                  {discountedPrice}
                </p>
              </div>
              <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                <Tag className="w-3.5 h-3.5" />
                Dto. MVZ - {mvzDiscountPercent}%
              </span>
            </div>
          ) : (
            <p className="text-[#1E1E1E] font-sans font-bold text-xl md:text-2xl">
              {priceDisplay}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="order-3 xl:order-none w-full text-center lg:text-left">
          <p className="text-[#757575] font-sans font-normal text-base md:text-lg leading-[1.6]">
            {product.description}
          </p>
        </div>

        {/* Interaction Section — mobile + desktop only; iPad uses full-width row below */}
        <div className="order-2 flex flex-col gap-6 w-full md:hidden xl:flex">
          {selectorsAndButtons}
        </div>

        {/* FAQs — mobile + desktop only; iPad uses full-width row below */}
        <div className="order-4 flex flex-col gap-4 mt-4 w-full md:hidden xl:flex">
          {faqsContent}
        </div>
        </div>
      </div>
      {/* iPad-only: Selectors + Buttons row (Row 2) */}
      <div className="hidden md:flex md:col-span-2 xl:hidden flex-col gap-6 w-full">
        {selectorsAndButtons}
      </div>

      {/* iPad-only: FAQs row (Row 3) */}
      <div className="hidden md:flex md:col-span-2 xl:hidden flex-col gap-4 w-full">
        {faqsContent}
      </div>

      <ProductImageGallery images={allImages} isOpen={isGalleryOpen} onOpenChange={setIsGalleryOpen} initialIndex={galleryInitialIndex}/>
    </section>
  );
}
