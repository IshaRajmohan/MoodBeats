'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Plus, Heart } from 'lucide-react'
import { useState } from 'react'

interface TrackPreviewProps {
  title: string
  artist: string
  album: string
  duration: string
  moodMatch: number
}

export function TrackPreview({
  title,
  artist,
  album,
  duration,
  moodMatch,
}: TrackPreviewProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg">
          🎵
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-primary">{moodMatch}%</p>
          <p className="text-xs text-muted-foreground">{duration}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-primary' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}
