'use client'

import { useEffect, useState } from 'react'

export function LoadingAnimation() {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    setBars(Array(8).fill(0).map(() => Math.random() * 100))
    const interval = setInterval(() => {
      setBars(Array(8).fill(0).map(() => Math.random() * 100))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end justify-center gap-1 h-16">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-2 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-200"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}
