'use client'

import { Card } from '@/components/ui/card'

interface EmotionData {
  emotion: string
  count: number
  percentage: number
  color: string
}

export function EmotionTrends() {
  const data: EmotionData[] = [
    { emotion: 'Happy', count: 28, percentage: 32, color: 'oklch(0.72 0.28 35)' },
    { emotion: 'Calm', count: 22, percentage: 25, color: 'oklch(0.75 0.22 280)' },
    { emotion: 'Creative', count: 18, percentage: 20, color: 'oklch(0.72 0.28 35)' },
    { emotion: 'Focused', count: 14, percentage: 16, color: 'oklch(0.75 0.22 280)' },
    { emotion: 'Peaceful', count: 6, percentage: 7, color: 'oklch(0.85 0.15 340)' },
  ]

  return (
    <Card className="p-6 border-primary/10">
      <h3 className="font-semibold text-foreground mb-4">Top Emotions (30 Days)</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">{item.emotion}</span>
              </div>
              <span className="text-sm font-semibold text-primary">{item.count} times</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: item.color,
                  width: `${item.percentage}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">{item.percentage}%</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
