'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmotionWheel } from '@/components/emotion-wheel'
import { MoodTimeline } from '@/components/mood-timeline'
import { CurrentTrack } from '@/components/current-track'
import { CameraFeed } from '@/components/camera-feed'
import { Menu, Settings, LogOut, Zap } from 'lucide-react'
import { useState } from 'react'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                  variant={item === 'Dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  {item}
                </Button>
              ))}
            </nav>
            <div className="space-y-2 border-t border-border pt-4">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Mood Today</h1>
              <p className="text-muted-foreground mt-1">Tuesday, November 18th</p>
            </div>
            <Button size="lg" className="gap-2">
              <Zap className="w-5 h-5" />
              Generate Playlist
            </Button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Emotion & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Emotion Wheel */}
              <Card className="p-8 border-primary/10">
                <h2 className="font-semibold text-foreground mb-6 text-center">Emotion Wheel</h2>
                <EmotionWheel />
              </Card>

              {/* Mood Timeline */}
              <MoodTimeline />
            </div>

            {/* Right Column - Camera & Track */}
            <div className="space-y-6">
              {/* Camera Feed */}
              <CameraFeed />

              {/* Current Track */}
              <CurrentTrack />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Today\'s Playlists', value: '3' },
              { label: 'Mood Score', value: '8.5/10' },
              { label: 'Session Time', value: '2h 15m' },
            ].map((stat, i) => (
              <Card key={i} className="p-4 text-center border-primary/10">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
