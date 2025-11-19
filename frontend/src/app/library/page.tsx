'use client'

import { Button } from '@/components/ui/button'
//import { Card } from '@/components/ui/card'
import { PlaylistCard } from '@/components/playlist-card'
import { Menu, Plus, Filter } from 'lucide-react'
import { useState } from 'react'

export default function LibraryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterActive, setFilterActive] = useState(false)

  const playlists = [
    {
      title: 'Morning Energy Boost',
      mood: 'Happy',
      trackCount: 24,
      duration: '1h 42m',
      isAI: true,
      color: 'oklch(0.72 0.28 35)',
    },
    {
      title: 'Late Night Vibes',
      mood: 'Calm',
      trackCount: 31,
      duration: '2h 15m',
      collaborators: ['AB', 'CD'],
      color: 'oklch(0.75 0.22 280)',
    },
    {
      title: 'Focused Work',
      mood: 'Focused',
      trackCount: 18,
      duration: '1h 24m',
      isAI: true,
      color: 'oklch(0.75 0.22 280)',
    },
    {
      title: 'Party Mode',
      mood: 'Excited',
      trackCount: 42,
      duration: '3h 8m',
      collaborators: ['AB', 'CD', 'EF'],
      color: 'oklch(0.72 0.28 35)',
    },
    {
      title: 'Reflective Mood',
      mood: 'Peaceful',
      trackCount: 22,
      duration: '1h 58m',
      isAI: true,
      color: 'oklch(0.85 0.15 340)',
    },
    {
      title: 'Creative Flow',
      mood: 'Creative',
      trackCount: 28,
      duration: '2h 5m',
      collaborators: ['AB'],
      color: 'oklch(0.72 0.28 35)',
    },
  ]

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
                  variant={item === 'Library' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  {item}
                </Button>
              ))}
            </nav>
            <div className="space-y-2 border-t border-border pt-4">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                Settings
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
              <h1 className="text-3xl font-bold text-foreground">My Library</h1>
              <p className="text-muted-foreground mt-1">6 playlists • 165 tracks</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" onClick={() => setFilterActive(!filterActive)}>
                <Filter className="w-5 h-5" />
              </Button>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                New Playlist
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          {filterActive && (
            <div className="flex gap-2 flex-wrap">
              {['All', 'AI Generated', 'Collaborative', 'Favorites'].map((tab) => (
                <Button
                  key={tab}
                  variant={tab === 'All' ? 'default' : 'outline'}
                  size="sm"
                >
                  {tab}
                </Button>
              ))}
            </div>
          )}

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist, i) => (
              <PlaylistCard key={i} {...playlist} />
            ))}
          </div>

          {/* Empty State */}
          {playlists.length === 0 && (
            <Card className="p-12 text-center border-primary/10">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No playlists yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first mood-matched playlist to get started
              </p>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Create Playlist
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
