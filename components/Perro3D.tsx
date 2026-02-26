'use client'

import { useRef, useState, useEffect } from "react"
import Image from "next/image"

const bodyParts = [
  { id: 'cuello',       src: '/img/perro3d/cuello.png',       label: 'Cuello' },
  { id: 'hombro',       src: '/img/perro3d/hombro.png',       label: 'Hombro' },
  { id: 'nalgas',       src: '/img/perro3d/nalgas.png',       label: 'Nalgas' },
  { id: 'pata_front',   src: '/img/perro3d/pata_front.png',   label: 'Pata frontal' },
  { id: 'rodilla_back', src: '/img/perro3d/rodilla_back.png', label: 'Rodilla trasera' },
]

const IMG_W = 990
const IMG_H = 1080

interface DogMapProps {
  onPartSelect?: (partId: string) => void
}

export default function DogMap({ onPartSelect }: DogMapProps) {
  const [activePart, setActivePart] = useState<string | null>(null)
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // tracking del mouse
  const [mousePos, setMousePos] = useState({x:0, y:0})

  // Carga cada parte en su canvas oculto para hit-detection
  useEffect(() => {
    bodyParts.forEach((part) => {
      const canvas = canvasRefs.current[part.id]
      if (!canvas) return

      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = part.src
      img.onload = () => {
        canvas.width = IMG_W
        canvas.height = IMG_H
        canvas.getContext('2d')?.drawImage(img, 0, 0)
      }
    })
  }, [])

  const getAlphaAtEvent = (partId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRefs.current[partId]
    const container = containerRef.current
    if (!canvas || !container) return 0

    const rect = container.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * IMG_W
    const y = ((e.clientY - rect.top) / rect.height) * IMG_H

    const ctx = canvas.getContext('2d')
    if (!ctx) return 0

    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
    return pixel[3]
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    for (let i = bodyParts.length - 1; i >= 0; i--) {
      const part = bodyParts[i]
      const alpha = getAlphaAtEvent(part.id, e)
      if (alpha > 10) {
        setActivePart(part.id)
        return
      }
    }
    setActivePart(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    for (let i = bodyParts.length - 1; i >= 0; i--) {
      const part = bodyParts[i]
      const alpha = getAlphaAtEvent(part.id, e)
      if (alpha > 10) {
        onPartSelect?.(part.id)
        return
      }
    }
  }

  return (
    <div
      ref={containerRef}
      // Usamos aspect-ratio para que el contenedor siempre respete 990:1080
      className="relative w-[588px] rounded-[32px] overflow-hidden cursor-pointer"
      style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActivePart(null)}
      onClick={handleClick}
    >
      {/* Canvas ocultos para hit-detection — uno por parte */}
      {bodyParts.map((part) => (
        <canvas
          key={part.id}
          ref={(el) => { canvasRefs.current[part.id] = el }}
          className="hidden"
        />
      ))}

      {/* Imagen base */}
      <Image
        src="/img/perro3d/bg.png"
        alt="Perro base"
        fill
        className="object-fill pointer-events-none"
      />

      {/* Capas de body parts */}
      {bodyParts.map((part) => (
        <Image
          key={part.id}
          src={part.src}
          alt={part.label}
          fill
          className={`
            object-fill pointer-events-none transition-all duration-150
            ${activePart === part.id
              ? 'opacity-80 brightness-125 saturate-150'
              : 'opacity-50'
            }
          `}
        />
      ))}

      {/* Tooltip opcional */}
      {activePart && (
        <div className="fixed bg-black/70 text-white text-sm px-3 py-1 rounded-full pointer-events-none"
        style={{
            left: mousePos.x + 12,
            top: mousePos.y - 32,
        }}
        >
          {bodyParts.find(p => p.id === activePart)?.label}
        </div>
      )}
    </div>
  )
}