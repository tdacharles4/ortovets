'use client'

import { useState, useEffect } from 'react'
import DogMap from '@/components/Perro3D'
import { ProductCardHorizontal } from '@/components/ProductCardHorizontal'
import { ShopifyProduct } from '@/lib/shopify'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Award, ShieldCheck, Heart } from "lucide-react";

const PLACEHOLDER_COUNT = 3

interface DogMapWithProductsProps {
  defaultProducts: ShopifyProduct[]
}

export function DogMapWithProducts({ defaultProducts }: DogMapWithProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(defaultProducts)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePartSelect = async (partId: string) => {
    // Toggle off if same part clicked again
    if (partId === selectedPart) {
      setSelectedPart(null)
      setProducts(defaultProducts)
      return
    }

    setSelectedPart(partId)
    setLoading(true)

    try {
      const res = await fetch(`/api/products/tag/${partId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: ShopifyProduct[] = await res.json()
      setProducts(data.length > 0 ? data : defaultProducts)
    } catch (err) {
      console.error('Error fetching products by tag:', err)
      setProducts(defaultProducts)
    } finally {
      setLoading(false)
    }
  }

  const partLabel: Record<string, string> = {
    cuello: 'Cuello',
    espalda: 'Espalda',
    cadera: 'Cadera',
    hombro: 'Hombro',
    codo: 'Codo',
    rodilla: 'Rodilla',
    pata_front: 'Pata frontal',
    pata_back: 'Pata trasera',
  }

  const features = [
    {
      icon: Clock,
      title: "Asesoría Especializada",
    },
    {
      icon: Award,
      title: "Calidad Garantizada",
    },
    {
      icon: ShieldCheck,
      title: "Compras Protegidas",
    },
    {
      icon: Heart,
      title: "Marca 100% Mexicana",
    },
  ];

  return (
    <>
      <div className="flex xl:flex-row flex-col conatiner px-4 lg:px-20 py-4 lg:py-10 gap-4 items-center">
        {/* FIRST SECTION */}
        <div className="flex flex-col gap-8 xl:basis-1/3">
          {/* Text Content Frame */}
          <div className="flex flex-col h-fit gap-4 lg:gap-[16px]">
            <div className="">
              <h1 className="text-[#FFFFFF] font-sans font-extrabold text-2xl md:text-3xl lg:text-[32px] leading-tight lg:leading-[100%] tracking-[0%] uppercase text-center lg:text-left">
                MEJORA LA MOVILIDAD DE TU MASCOTA
              </h1>
            </div>
            <div className="">
              <p className="text-[#FFFFFF] font-sans font-medium text-lg md:text-xl lg:text-[24px] leading-snug lg:leading-[100%] tracking-[0%] text-center lg:text-left">
                Productos ortpédicos especializados diseñados por veterinarios para el bienestar de tus mascotas.
              </p>
            </div>
            {/* Stats/Features Container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row h-fit gap-4 lg:gap-[16px]">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col flex-1 h-[118px] p-4 justify-center items-center gap-[12px] bg-white/10 rounded-lg backdrop-blur-sm transition-all hover:bg-white/20">
                  <feature.icon className="w-8 h-8 text-white shrink-0" />
                  <h3 className="text-white font-sans font-bold text-[11px] leading-tight text-center">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Redirection Buttons Frame */}
          <div className="flex flex-col sm:flex-row h-auto gap-4 w-full">
            {/* Button 1: Ver productos */}
            <Button asChild className="flex-1 min-w-0 bg-[#8CC63F] hover:bg-[#7ab336] text-[#F5F5F5] rounded-[16px] flex items-center justify-center border-none shadow-none h-auto py-3">
              <Link href="/tienda" className="flex items-center justify-center gap-2 w-full">
                <span className="font-sans font-semibold text-lg">Ver productos</span>
                <ArrowRight className="w-[30px] h-[30px] shrink-0" />
              </Link>
            </Button>

            {/* Button 2: Agenda una cita */}
            <Button asChild className="flex-1 min-w-0 bg-transparent border-2 border-[#FFFFFF] hover:bg-white/10 text-white rounded-[16px] flex items-center justify-center shadow-none h-auto py-3">
              <Link href="/consultas" className="flex items-center justify-center gap-2 w-full">
                <span className="font-sans font-semibold text-lg">Agenda una cita</span>
                <Calendar className="w-[30px] h-[30px] shrink-0" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 xl:basis-2/3">
          {/* PERRO 3D */}
          <div className='flex flex-col gap-2 basis-1/2'>
            {/* TEXT HAZ CLIC */}
            <div className='flex items-end min-h-12'>
              <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-tight text-center">
                Haz clic en cualquier zona del cuerpo del perro para ver productos ortopédicos específicos para esa área.
              </p>
            </div>

            {/* PERRO 3D */}
            <div className="w-full flex justify-center">
              <DogMap onPartSelect={handlePartSelect} />
            </div>
          </div>

          {/* PRODUCTOS RECOMENDADOS */}
          <div className="flex flex-col gap-2 basis-1/2">
            {/* TEXT PRODUCTOS */}
            <div className="flex items-end justify-center min-h-12">
              <h2 className="text-[#F5F5F5] font-sans font-semibold text-xl lg:text-[22px] leading-tight text-center uppercase">
                {selectedPart
                  ? `Productos para ${partLabel[selectedPart] ?? selectedPart}`
                  : 'Productos Recomendados'}
              </h2>
            </div>

            {/* PRODUCTOS RECOMENDADOS */}
            <div className="flex flex-col w-full h-auto gap-6 lg:gap-4">
              <div className="flex flex-col w-full h-auto gap-6 lg:gap-[16px]">

                {/* Product Cards */}
                <div className="flex flex-col gap-4">
                  {loading ? (
                    // Skeleton placeholders while loading
                    Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="w-full h-[148px] bg-white/10 rounded-[32px] animate-pulse"
                      />
                    ))
                  ) : (
                    <>
                      {products.slice(0, 3).map((product) => (
                        <ProductCardHorizontal key={product.id} product={product} />
                      ))}
                      {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                        <div key={`placeholder-${i}`} className="w-full h-[148px] bg-white/10 rounded-[32px]" />
                      ))}
                    </>
                  )}
                </div>

                {/* Redirection link */}
                <div className="flex flex-row items-center justify-center w-full gap-2 mt-4 lg:mt-0">
                  <a
                    href={selectedPart ? `/tienda?tag=${selectedPart}` : '/tienda'}
                    className="flex items-center gap-2 text-[#F5F5F5] hover:opacity-80 transition-opacity"
                  >
                    <span className="font-sans font-medium text-lg leading-[100%] underline decoration-solid text-center lg:text-center">
                      Ver más productos recomendados
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}