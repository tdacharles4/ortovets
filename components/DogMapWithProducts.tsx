'use client'

import { useState } from 'react'
import DogMap from '@/components/Perro3D'
import { ProductCardHorizontal } from '@/components/ProductCardHorizontal'
import { ShopifyProduct } from '@/lib/shopify'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from "next/image"
import { ArrowRight, Calendar, Clock, Award, ShieldCheck, Heart } from "lucide-react";

const PLACEHOLDER_COUNT = 3

interface DogMapWithProductsProps {
  defaultProducts: ShopifyProduct[]
}

export function DogMapWithProducts({ defaultProducts }: DogMapWithProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(defaultProducts)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleIpadPartSelect = (partId: string) => {
    setSelectedPart(prev => prev === partId ? null : partId)
  }

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
      const [tagRes, allRes] = await Promise.all([
        fetch(`/api/products/tag/${partId}`),
        fetch(`/api/products/tag/all`),
      ])
      if (!tagRes.ok || !allRes.ok) throw new Error('Failed to fetch')
      const tagProducts: ShopifyProduct[] = await tagRes.json()
      const allProducts: ShopifyProduct[] = await allRes.json()
      const allIds = new Set(allProducts.map(p => p.id))
      const tagOnly = tagProducts.filter(p => !allIds.has(p.id))
      const combined = [...tagOnly, ...allProducts]
      setProducts(combined.length > 0 ? combined : defaultProducts)
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
    tarso: 'Tarso o Tobillo',
    carpo: 'Carpo o Muñeca',
    mano: 'Mano',
    pataydedos: 'Pata y Dedos',
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
      <div className="flex flex-col md:flex-row px-4 md:px-4 lg:px-20 py-4 md:py-6 lg:py-10 gap-4 md:gap-8 xl:gap-6 items-center">
        {/* FIRST SECTION */}
        <div className="flex flex-col gap-8 w-full md:w-[45%] xl:basis-1/3">
          {/* Text Content Frame */}
          <div className="flex flex-col h-fit gap-8 lg:gap-[32px]">
            <div className="w-auto h-auto md:hidden xl:block">
              <Image
                  src="/img/landing-logo.png"
                  alt="Ortovets"
                  width="683"
                  height="252"
                  className="object-contain pointer-events-none"
                />
            </div>
            <div className="inline-flex self-start items-center gap-2 bg-[#2B4A7C] rounded-full px-4 py-2">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#8CC63F] shrink-0"/>
              <h1 className="text-white font-bold text-2xl uppercase tracking-wide whitespace-nowrap">
                Marca #1 en México
              </h1>
            </div>
            <p className="hidden md:block xl:hidden text-[#1E2939] font-semibold text-lg leading-snug">
              Soluciones ortopédicas para tu mascota
            </p>
            <div className="" style={{ fontFamily: 'var(--font-quicksand)'}}>
              <p className="text-[#1E2939] font-sans font-medium text-lg md:text-xl lg:text-[24px] leading-snug lg:leading-[100%] tracking-[0%] text-center md:text-left">
                Productos ortpédicos especializados diseñados por veterinarios para el bienestar de tus mascotas.
              </p>
            </div>
            {/* Stats/Features Container */}
            <div className="mt-4 xl:mt-16 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row h-fit gap-4 lg:gap-[32px]">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col flex-1 h-[118px] p-4 justify-center items-center gap-[12px] bg-white/10 rounded-lg backdrop-blur-sm transition-all hover:bg-white/20">
                  <div className="flex items-center justify-center w-[70px] h-[70px] rounded-full bg-[#AAE099]/20 shrink-0">
                    <feature.icon className="w-8 h-8 text-[#1E2939]" />
                  </div>
                  <p className="text-[#1E2939] font-sans font-bold text-[11px] leading-tight text-center">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Redirection Buttons Frame */}
          <div className="mt-6 flex flex-col sm:flex-row h-auto gap-4 w-full">
            {/* Button 1: Ver productos */}
            <Button asChild className="flex-1 min-w-0 bg-[#8CC63F] hover:bg-[#7ab336] text-[#F5F5F5] rounded-[16px] flex items-center justify-center border-none shadow-none h-auto py-3">
              <Link href="/tienda" className="flex items-center justify-center gap-2 w-full">
                <span className="font-sans font-semibold text-lg">Ver productos</span>
                <ArrowRight className="w-[30px] h-[30px] shrink-0" />
              </Link>
            </Button>

            {/* Button 2: Agenda una cita */}
            <Button asChild className="flex-1 min-w-0 bg-[#ffffff]/57 border-2 border-[##1E293952]/32 hover:bg-white/10 text-[#1E2939] rounded-[16px] flex items-center justify-center shadow-none h-auto py-3">
              <Link href="/consultas" className="flex items-center justify-center gap-2 w-full">
                <span className="font-sans font-semibold text-lg">Agenda una cita</span>
                <Calendar className="w-[30px] h-[30px] shrink-0" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-[55%] xl:basis-2/3">

          {/* iPad-only simplified view */}
          <div className="hidden md:flex xl:hidden flex-col items-center justify-center gap-4 h-full py-4">
            <h2 className="text-[#2B4A7C] font-sans font-semibold text-xl uppercase text-center">
              {selectedPart
                ? `Productos Recomendados para ${partLabel[selectedPart] ?? selectedPart}`
                : 'Selecciona la zona afectada'}
            </h2>
            <div className="w-full flex justify-center">
              <DogMap onPartSelect={handleIpadPartSelect} />
            </div>
            {selectedPart && (
              <Link
                href={`/tienda?tag=${selectedPart}`}
                className="flex items-center gap-2 text-[#4C83DC] hover:opacity-80 transition-opacity"
              >
                <span className="font-sans font-medium text-lg underline text-center">
                  Ver más productos recomendados
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile & Desktop full grid view */}
          <div className="grid md:hidden xl:grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">

          {/* 1 - TEXT HAZ CLICK  */}
          <div className="order-1 xl:order-1 flex items-end min-h-12">
            <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-tight text-center">

            </p>
          </div>

          {/* 2 - TEXT PRODUCTOS */}
          <div className="order-3 xl:order-2 flex items-end justify-center min-h-12">
            <h2 className="text-[#2B4A7C] font-sans font-semibold text-xl lg:text-[22px] leading-tight text-center uppercase">
              {selectedPart
                ? `Productos Recomendados para ${partLabel[selectedPart] ?? selectedPart}`
                : 'Productos Recomendados'}
            </h2>
          </div>

          {/* 3 - PERRO  ULISES */}
          <div className="order-2 xl:order-3 flex flex-col gap-2 text-center">
            <div className="w-full flex justify-center text-center">
              <DogMap onPartSelect={handlePartSelect} />
            </div>
            <h2 className="-mt-6 translate-x-8 text-[#2B4A7C] uppercase text-xl">Selecciona la zona afectada</h2>
          </div>

          {/* 4 - PRODUCTOS */}
          <div className="mt-24 order-4 xl:order-4 flex flex-col gap-2">
            <div className="flex flex-col w-full h-auto gap-6 lg:gap-4">
              <div className="flex flex-col w-full h-auto gap-6 lg:gap-[16px]">

                {/* Product Cards */}
                <div className="flex flex-col gap-4">
                  {loading ? (
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
                  <Link
                    href={selectedPart ? `/tienda?tag=${selectedPart}` : '/tienda'}
                    className="flex items-center gap-2 text-[#4C83DC] hover:opacity-80 transition-opacity"
                  >
                    <span className="font-sans font-medium text-lg leading-[100%] underline text-center">
                      Ver más productos recomendados
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          </div>{/* end mobile & desktop grid */}
        </div>{/* end right section */}
      </div>
    </>
  )
}