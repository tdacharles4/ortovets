"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import InnerImageZoom from "react-inner-image-zoom";
import 'react-inner-image-zoom/lib/styles.min.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

type Image={
    url:string;
    altText:string|null;
};
interface ProductImageGalleryProps{
    images:Image[];
    isOpen:boolean;
    onOpenChange:(isOpen:boolean)=>void;
    initialIndex:number;
}



export function ProductImageGallery({images,isOpen,onOpenChange,initialIndex}:ProductImageGalleryProps){

    // galeria expansible 1.1. estados de galeria abierta e indice inicial
    // galeria expansible 2.1 Estados del Carousel API (shadcn) de la galeria
    const [galleryApi, setGalleryApi] = React.useState<any>();

    React.useEffect(()=>{
        if(galleryApi&&isOpen){
            setTimeout(()=>{
            galleryApi.scrollTo(initialIndex, true);
            },10);
        }
    },[galleryApi,isOpen,initialIndex]);
    
    return(
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-fit max-w-[95vw] sm:max-w-none h-fit max-h-[98vh] bg-white px-16 md:px-32 py-12 md:py-20 flex flex-col gap-8 items-center">
          <DialogHeader className="sr-only">
            <DialogTitle>Galeria de imagenes de producto</DialogTitle>
            <DialogDescription>Una galeria de imagenes del producto. Use las teclas de flecha o la miniatura para navegar las imagenes.</DialogDescription>
          </DialogHeader>
          <div className="relative w-full flex justify-center">
            <Carousel setApi={setGalleryApi} opts={{ loop: true }} className="w-[85vw] sm:w-[60vw] max-w-[450px] lg:max-w-[600px] aspect-square">
              <CarouselContent className="h-full">
                {images.map((image,index)=>(
                  <CarouselItem key={index} className="h-full">
                    <div className="relative inline-block w-full h-full flex items-center justify-center overflow-hidden select-none">
                      <InnerImageZoom
                        src={image.url}
                        zoomSrc={image.url}
                        zoomType="hover"
                        className="object-contain"
                        moveType="pan"
                        hideHint={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-14 lg:-left-20" />
              <CarouselNext className="hidden md:flex -right-14 lg:-right-20" />
            </Carousel>
          </div>

          <div className="w-full max-w-[450px] lg:max-w-[600px]">
            <Carousel opts={{slidesToScroll:1, align:"start", loop: true}} className="w-full">
              <CarouselContent className="-ml-2 justify-center">
                {images.map((image,index)=>(
                  <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5">
                    <div
                      className="relative aspect-square cursor-pointer"
                      onClick={()=>galleryApi?.scrollTo(index)}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index+1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    );
}