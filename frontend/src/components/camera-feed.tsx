'use client'

import { Card } from '@/components/ui/card'
import { Video, VideoOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CameraFeed() {
  const [isActive, setIsActive] = useState(true)

  return (
    <Card className={`border-2 overflow-hidden transition-colors ${isActive ? 'border-primary/30' : 'border-muted'}`}>
      <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group">
        {isActive ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
            <div className="text-center text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Camera Feed</p>
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <div className="px-2 py-1 bg-primary/90 rounded text-xs text-primary-foreground font-semibold">
                ✓ Live
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <VideoOff className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Camera Disabled</p>
          </div>
        )}
        
        {/* Toggle Button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Stop' : 'Start'}
        </Button>
      </div>
    </Card>
  )
}
