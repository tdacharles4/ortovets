'use client'

import { useState } from "react"
import DogMap from "@/components/Perro3D"
import { ProductCardHorizontal } from "@/components/ProductCardHorizontal"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ShopifyProduct } from "@/lib/shopify"

interface DogSectionProps {
  initialProducts: ShopifyProduct[]
}

export default function DogSection({ initialProducts }: DogSectionProps) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)

  const handlePartSelect = async (partId: string) => {
    setSelectedPart(partId)
    const res = await fetch(`/api/products?tag=${partId}`)
    const data = await res.json()
    setProducts(data)
  }

  return (
    <div className="flex flex-row w-[1080px] h-[700px] gap-[16px] bg-transparent">
      <div className="flex flex-col w-[588px] h-[710px] gap-[16px] bg-transparent">
        <div className="flex flex-row items-center justify-center w-[542px] h-[64px] gap-[10px] mx-auto">
          <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-[100%] text-center">
            Haz clic en cualquier zona del cuerpo del perro para ver productos ortopédicos específicos para esa área.
          </p>
        </div>
        <DogMap onPartSelect={handlePartSelect} />
      </div>

      <div className="flex flex-col w-[476px] h-[700px] pt-[28px] gap-[16px] bg-transparent">
        <div className="flex flex-col w-[476px] h-auto min-h-[614px] gap-[16px]">
          <div className="flex flex-col w-[374px] h-[44px] gap-[8px] mx-auto">
            <h2 className="text-[#F5F5F5] font-sans font-semibold text-[22px] leading-[100%] text-center uppercase">
              {selectedPart
                ? `Productos para ${selectedPart}`
                : 'Selecciona una zona del perro'}
            </h2>
          </div>

          <div className="flex flex-col gap-[16px]">
            {products.map((product) => (
              <ProductCardHorizontal key={product.id} product={product} />
            ))}
            {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="w-[476px] h-[148px] bg-white/10 rounded-[32px]" />
            ))}
          </div>

          <div className="flex flex-row items-center w-[278px] h-[63px] gap-[8px]">
            <Link href="/tienda" className="flex items-center gap-[8px] text-[#F5F5F5] hover:opacity-80 transition-opacity">
              <span className="font-sans font-medium text-lg leading-[100%] underline decoration-solid">
                Ver más productos recomendados
              </span>
              <ArrowRight className="w-[30px] h-[30px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}