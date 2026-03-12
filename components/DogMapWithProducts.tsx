'use client'

import { useState, useEffect } from 'react'
import DogMap from '@/components/Perro3D'
import { ProductCardHorizontal } from '@/components/ProductCardHorizontal'
import { ShopifyProduct } from '@/lib/shopify'

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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TEXT HAZ CLIC */}
        <div className='flex items-end'>
          <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-tight text-center">
            Haz clic en cualquier zona del cuerpo del perro para ver productos ortopédicos específicos para esa área.
          </p>
        </div>

        {/* TEXT PRODUCTOS */}
        <div className="flex items-end justify-center h-full">
          <h2 className="text-[#F5F5F5] font-sans font-semibold text-xl lg:text-[22px] leading-tight text-center uppercase">
            {selectedPart
              ? `Productos para ${partLabel[selectedPart] ?? selectedPart}`
              : 'Productos Recomendados'}
          </h2>
        </div>

        {/* PERRO 3D */}
        <div className="w-full flex justify-center">
          <DogMap onPartSelect={handlePartSelect} />
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
    </>
  )
}