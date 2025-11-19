'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoodHeatmap } from '@/components/mood-heatmap'
import { EmotionTrends } from '@/components/emotion-trends'
import { Menu, Download } from 'lucide-react'
import { useState } from 'react'

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month')

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col p-4 gap-4`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="self-end"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {sidebarOpen && (
          <>
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mt-4">
              Menu
            </div>
            <nav className="space-y-2 flex-1">
              {['Dashboard', 'Library', 'History', 'Collaborate'].map((item) => (
                <Button
                  key={item}
                  variant={item === 'History' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  {item}
                </Button>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Mood Analytics</h1>
              <p className="text-muted-foreground mt-1">Track your emotional patterns over time</p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  onClick={() => setTimeRange(range)}
                  capitalize
                >
                  {range === 'all' ? 'All Time' : range === 'week' ? 'Last 7d' : 'Last 30d'}
                </Button>
              ))}
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Average Mood', value: '7.2/10', trend: '+0.5' },
              { label: 'Playlists Created', value: '12', trend: '+3' },
              { label: 'Total Listen Time', value: '32h 45m', trend: '+2h' },
              { label: 'This Month', value: '28 days', trend: '↑ Consistent' },
            ].map((stat, i) => (
              <Card key={i} className="p-4 border-primary/10">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
              </Card>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Heatmap */}
            <MoodHeatmap />

            {/* Emotion Trends */}
            <EmotionTrends />
          </div>

          {/* Insights */}
          <Card className="p-6 border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
            <h3 className="font-semibold text-foreground mb-4">Key Insights</h3>
            <div className="space-y-3">
              {[
                '🎵 You listen most when Happy or Creative - consider creating more playlists for these moods',
                '📈 Your mood is most positive on weekends (average 8.2/10 vs 7.1/10 weekdays)',
                '🎧 Average listening session is 1h 45m, usually in the evening',
                '❤️ Your top 3 emotions are Happy (32%), Calm (25%), and Creative (20%)',
              ].map((insight, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="flex-shrink-0" />
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Listening Habits */}
          <Card className="p-6 border-primary/10">
            <h3 className="font-semibold text-foreground mb-4">Listening Habits by Time of Day</h3>
            <div className="space-y-4">
              {[
                { time: 'Morning (6-9am)', activity: '15%', color: 'oklch(0.72 0.28 35)' },
                { time: 'Afternoon (12-3pm)', activity: '25%', color: 'oklch(0.72 0.28 35)' },
                { time: 'Evening (5-8pm)', activity: '45%', color: 'oklch(0.65 0.25 280)' },
                { time: 'Night (8pm-12am)', activity: '15%', color: 'oklch(0.85 0.15 340)' },
              ].map((habit, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{habit.time}</span>
                    <span className="text-sm font-semibold text-primary">{habit.activity}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: habit.color,
                        width: habit.activity,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
