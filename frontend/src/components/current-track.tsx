'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useState } from 'react'

export function CurrentTrack() {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <Card className="p-6 border-primary/10 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Album Art */}
        <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <div className="text-6xl mb-2">🎵</div>
            <p className="text-sm text-muted-foreground">Album Art</p>
          </div>
        </div>

        {/* Track Info */}
        <div>
          <h3 className="font-semibold text-foreground text-lg">Blowing in the Wind</h3>
          <p className="text-sm text-muted-foreground">Bob Dylan</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1:15</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
