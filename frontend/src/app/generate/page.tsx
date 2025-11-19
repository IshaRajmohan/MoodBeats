'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingAnimation } from '@/components/loading-animation'
import { TrackPreview } from '@/components/track-preview'
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isGenerating) return
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsGenerating(false)
          return 100
        }
        return p + Math.random() * 30
      })
    }, 800)
    
    return () => clearInterval(interval)
  }, [isGenerating])

  const generatedPlaylist = {
    title: 'Happy Vibes - November 18',
    mood: 'Happy',
    confidence: 89,
    generatedAt: new Date().toLocaleTimeString(),
    tracks: [
      { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', album: 'Walking on Sunshine', duration: '3:43', moodMatch: 95 },
      { title: 'Good as Hell', artist: 'Lizzo', album: 'Cuz I Love You', duration: '3:16', moodMatch: 92 },
      { title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'News of the World', duration: '3:36', moodMatch: 89 },
      { title: 'Walking On Sunshine', artist: 'Mr. Blue Sky', album: 'Out of the Blue', duration: '5:02', moodMatch: 87 },
      { title: 'Good Life', artist: 'Three Days Grace', album: 'Recovery', duration: '3:59', moodMatch: 85 },
      { title: 'Shut Up and Dance', artist: 'Walk the Moon', album: 'Walk the Moon', duration: '3:48', moodMatch: 88 },
    ],
  }

  if (isGenerating) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-primary/10 p-8">
          <div className="space-y-8 text-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Reading your mood...</h1>
              <p className="text-muted-foreground">
                Our AI is composing the perfect playlist for you
              </p>
            </div>

            {/* Loading Animation */}
            <LoadingAnimation />

            {/* Progress */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{Math.min(Math.round(progress), 100)}%</p>
            </div>

            {/* Loading Messages */}
            <div className="text-sm text-muted-foreground italic">
              {progress < 30 && "Analyzing emotions..."}
              {progress >= 30 && progress < 60 && "Scanning music library..."}
              {progress >= 60 && progress < 90 && "Orchestrating tracks..."}
              {progress >= 90 && "Finalizing playlist..."}
            </div>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Playlist Info */}
        <Card className="relative overflow-hidden border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl flex-shrink-0">
                🎵
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{generatedPlaylist.title}</h1>
                <div className="flex items-center gap-4">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: 'oklch(0.72 0.28 35)' }}
                  >
                    {generatedPlaylist.mood}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {generatedPlaylist.confidence}% Match
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {generatedPlaylist.tracks.length} tracks
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" className="gap-2">
                <span>Play Playlist</span>
              </Button>
              <Button size="lg" variant="secondary" className="gap-2">
                <Download className="w-5 h-5" />
                Save
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => setIsGenerating(true)}>
                <RefreshCw className="w-5 h-5" />
                Regenerate
              </Button>
            </div>
          </div>
        </Card>

        {/* Track List */}
        <Card className="border-primary/10">
          <div className="p-6 space-y-1">
            <h2 className="font-semibold text-foreground mb-4">Tracks in Playlist</h2>
            {generatedPlaylist.tracks.map((track, i) => (
              <TrackPreview key={i} {...track} />
            ))}
          </div>
        </Card>

        {/* Playlist Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Duration', value: '23m 24s' },
            { label: 'Average Energy', value: '8.2/10' },
            { label: 'Genres', value: '6 Genres' },
          ].map((stat, i) => (
            <Card key={i} className="p-4 text-center border-primary/10">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
