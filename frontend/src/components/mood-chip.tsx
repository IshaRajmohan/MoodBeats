'use client'

interface MoodChipProps {
  mood: string
  confidence: number
  color: string
}

export function MoodChip({ mood, confidence, color }: MoodChipProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span>{mood}</span>
      <span className="opacity-80">{confidence}%</span>
    </div>
  )
}
