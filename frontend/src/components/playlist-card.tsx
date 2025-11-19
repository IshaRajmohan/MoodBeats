'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Share2, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface PlaylistCardProps {
  title: string
  mood: string
  trackCount: number
  duration: string
  isAI?: boolean
  collaborators?: string[]
  color: string
}

export function PlaylistCard({
  title,
  mood,
  trackCount,
  duration,
  isAI,
  collaborators,
  color,
}: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover */}
      <div className="relative aspect-square bg-gradient-to-br overflow-hidden" style={{
        backgroundImage: `linear-gradient(135deg, ${color}20, ${color}40)`,
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl opacity-30">🎵</div>
        </div>

        {/* AI Badge */}
        {isAI && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-accent/90 rounded-full text-xs font-semibold text-accent-foreground">
            ✨ AI
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
            <Button size="icon" className="rounded-full w-12 h-12">
              <Play className="w-5 h-5 fill-current" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Collaborators */}
        {collaborators && collaborators.length > 0 && (
          <div className="absolute bottom-2 right-2 flex -space-x-2">
            {collaborators.slice(0, 3).map((collab, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-primary/40 border border-primary-foreground/30 flex items-center justify-center text-xs font-bold text-primary-foreground"
                title={collab}
              >
                {collab[0]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {mood}
          </p>
        </div>

        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>{trackCount} tracks</p>
          <p>{duration}</p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="flex-1 h-8">
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 h-8 text-destructive hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
