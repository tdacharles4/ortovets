"use client";

import * as React from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";

type Article = {
    title: string,
    image: {
        url: string;
        altText: string | null;
    } | null
};

export function NoticieroCarousel({articles}: {articles: Article[]}){
    return(
        <Carousel 
            className="w-full h-full"
            plugins={[
                Autoplay({
                delay: 5000,
                }),
            ]}
            opts={{
                loop: true,
            }}
            >
            <CarouselContent className="h-full">
            {articles.map((article,index)=>(
                <CarouselItem key={index} className="h-full">
                {article.image && (
                    <div className="w-full h-full relative rounded-[16px] overflow-hidden">
                    <Image
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        fill
                        className="object-cover"
                    />
                    </div>
                )}
                </CarouselItem>
            ))}
            </CarouselContent>
        </Carousel>
    );
}