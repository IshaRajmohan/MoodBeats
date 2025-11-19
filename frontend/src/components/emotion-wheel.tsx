'use client'

import { useState, useEffect } from 'react'

interface Emotion {
  name: string
  value: number
  angle: number
  color: string
}

export function EmotionWheel() {
  const [emotions] = useState<Emotion[]>([
    { name: 'Happy', value: 85, angle: 0, color: 'oklch(0.72 0.28 35)' },
    { name: 'Excited', value: 72, angle: 45, color: 'oklch(0.72 0.28 35)' },
    { name: 'Calm', value: 60, angle: 90, color: 'oklch(0.75 0.22 280)' },
    { name: 'Focused', value: 78, angle: 135, color: 'oklch(0.75 0.22 280)' },
    { name: 'Sad', value: 45, angle: 180, color: 'oklch(0.85 0.15 340)' },
    { name: 'Peaceful', value: 88, angle: 225, color: 'oklch(0.75 0.22 280)' },
    { name: 'Energetic', value: 95, angle: 270, color: 'oklch(0.72 0.28 35)' },
    { name: 'Creative', value: 82, angle: 315, color: 'oklch(0.72 0.28 35)' },
  ])

  const maxValue = Math.max(...emotions.map(e => e.value))
  const dominantEmotion = emotions.reduce((a, b) => a.value > b.value ? a : b)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64">
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((opacity, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{
              transform: `scale(${1 - i * 0.25})`,
            }}
          />
        ))}

        {/* Emotion points */}
        {emotions.map((emotion, i) => {
          const radius = (emotion.value / maxValue) * 120
          const rad = (emotion.angle * Math.PI) / 180
          const x = Math.cos(rad) * radius
          const y = Math.sin(rad) * radius
          
          return (
            <div
              key={i}
              className="absolute w-12 h-12 -left-6 -top-6 transition-all duration-300"
              style={{
                transform: `translate(calc(50% + ${x}px), calc(50% + ${y}px))`,
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: emotion.color }}
                title={`${emotion.name}: ${emotion.value}%`}
              >
                {emotion.value}
              </div>
            </div>
          )
        })}

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold text-primary-foreground">{dominantEmotion.value}%</div>
            <div className="text-xs text-primary-foreground/80">{dominantEmotion.name}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {emotions.map((emotion) => (
          <div key={emotion.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: emotion.color }}
            />
            <span className="text-sm text-muted-foreground">{emotion.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
