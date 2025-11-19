'use client'

import { Card } from '@/components/ui/card'

interface HeatmapDay {
  date: string
  day: string
  intensity: number
  mood: string
}

export function MoodHeatmap() {
  const weeks = [
    [
      { date: '11', day: 'Sun', intensity: 0.3, mood: 'Low' },
      { date: '12', day: 'Mon', intensity: 0.7, mood: 'Happy' },
      { date: '13', day: 'Tue', intensity: 0.85, mood: 'Happy' },
      { date: '14', day: 'Wed', intensity: 0.6, mood: 'Calm' },
      { date: '15', day: 'Thu', intensity: 0.9, mood: 'Excited' },
      { date: '16', day: 'Fri', intensity: 0.8, mood: 'Creative' },
      { date: '17', day: 'Sat', intensity: 0.95, mood: 'Energetic' },
    ],
  ]

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted'
    if (intensity < 0.3) return 'bg-primary/20'
    if (intensity < 0.6) return 'bg-primary/50'
    if (intensity < 0.8) return 'bg-primary/75'
    return 'bg-primary'
  }

  return (
    <Card className="p-6 border-primary/10">
      <h3 className="font-semibold text-foreground mb-4">Mood Heatmap (Last 7 Days)</h3>
      <div className="space-y-4">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              {week.map((day, i) => (
                <div key={i} className="space-y-1">
                  <div
                    className={`w-full aspect-square rounded-lg border border-border/50 transition-all cursor-pointer hover:scale-110 ${getColor(
                      day.intensity
                    )}`}
                    title={`${day.date} - ${day.mood}`}
                  />
                  <p className="text-xs text-muted-foreground text-center">{day.day}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {[0, 0.3, 0.6, 0.8, 1].map((intensity, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded ${
                intensity === 0
                  ? 'bg-muted'
                  : `bg-primary/[${intensity}]`
              }`}
              style={{
                backgroundColor: `hsl(280, 100%, ${70 - intensity * 40}%)`,
              }}
            />
          ))}
        </div>
        <span className="text-muted-foreground">More</span>
      </div>
    </Card>
  )
}
