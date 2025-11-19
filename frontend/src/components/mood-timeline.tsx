'use client'

import { Card } from '@/components/ui/card'

interface MoodEntry {
  time: string
  emotion: string
  confidence: number
  color: string
}

export function MoodTimeline() {
  const moods: MoodEntry[] = [
    { time: '2:45 PM', emotion: 'Happy', confidence: 89, color: 'oklch(0.72 0.28 35)' },
    { time: '2:30 PM', emotion: 'Focused', confidence: 78, color: 'oklch(0.75 0.22 280)' },
    { time: '2:15 PM', emotion: 'Calm', confidence: 85, color: 'oklch(0.75 0.22 280)' },
    { time: '2:00 PM', emotion: 'Energetic', confidence: 92, color: 'oklch(0.72 0.28 35)' },
  ]

  return (
    <Card className="p-6 border-primary/10">
      <h3 className="font-semibold text-foreground mb-4">Mood History</h3>
      <div className="space-y-3">
        {moods.map((mood, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{mood.emotion}</p>
                <p className="text-xs text-muted-foreground">{mood.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: mood.color,
                    width: `${mood.confidence}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                {mood.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
