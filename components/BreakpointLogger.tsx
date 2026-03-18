'use client'

import { useEffect } from 'react'

export function BreakpointLogger() {
  useEffect(() => {
    const check = () => {
      const redirection = document.getElementById('redirection-frame')
      const dog = document.getElementById('dog-frame')
      if (!redirection || !dog) return

      const rTop = redirection.offsetTop
      const dTop = dog.offsetTop
      const stacked = dTop > rTop + 10

      console.log(
        `[Layout] viewport=${window.innerWidth}px | redirection.offsetTop=${rTop} | dog.offsetTop=${dTop} | → ${stacked ? '⬆ STACKED (on top)' : '↔ SIDE BY SIDE'}`
      )
    }

    check()

    const observer = new ResizeObserver(check)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [])

  return null
}
