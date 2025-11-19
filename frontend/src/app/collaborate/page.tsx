
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CollaboratorAvatar } from '@/components/collaborator-avatar'
import { InviteModal } from '@/components/invite-modal'
import { TrackPreview } from '@/components/track-preview'
import { ArrowLeft, Users, Plus, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'

export default function CollaboratePage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [tracks, setTracks] = useState([
    { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', album: 'Walking on Sunshine', duration: '3:43', moodMatch: 95 },
    { title: 'Good as Hell', artist: 'Lizzo', album: 'Cuz I Love You', duration: '3:16', moodMatch: 92 },
    { title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'News of the World', duration: '3:36', moodMatch: 89 },
    { title: 'Walking On Sunshine', artist: 'Mr. Blue Sky', album: 'Out of the Blue', duration: '5:02', moodMatch: 87 },
  ])

  const collaborators = [
    { name: 'You', initials: 'ME', color: 'oklch(0.65 0.25 280)', isActive: true },
    { name: 'Alex Brown', initials: 'AB', color: 'oklch(0.72 0.28 35)', isActive: true },
    { name: 'Casey Kim', initials: 'CK', color: 'oklch(0.85 0.15 340)', isActive: false },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Link href="/library">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Button>
        </Link>

        {/* Playlist Header */}
        <Card className="border-primary/10 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                🎵
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Party Mode</h1>
                <p className="text-muted-foreground">Excited • 89% Match</p>
              </div>
            </div>
            <Button className="gap-2" onClick={() => setIsInviteOpen(true)}>
              <Users className="w-5 h-5" />
              Invite
            </Button>
          </div>

          {/* Collaborators */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Active Collaborators</p>
            <div className="flex items-center gap-2">
              {collaborators.map((collab) => (
                <CollaboratorAvatar
                  key={collab.name}
                  {...collab}
                />
              ))}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => setIsInviteOpen(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Track List with Reordering */}
        <Card className="border-primary/10">
          <div className="p-6 space-y-1">
            <h2 className="font-semibold text-foreground mb-4">Drag to Reorder</h2>
            {tracks.map((track, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
                <div className="flex-1">
                  <TrackPreview {...track} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Add Track */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="w-full gap-2 justify-center">
                <Plus className="w-4 h-4" />
                Add Track
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="border-primary/10 p-6">
          <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { user: 'Alex Brown', action: 'added "Good as Hell"', time: '5 min ago' },
              { user: 'You', action: 'moved "Don\'t Stop Me Now"', time: '8 min ago' },
              { user: 'Casey Kim', action: 'joined the collaboration', time: '2h ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-foreground">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        playlistName="Party Mode"
        shareLink="https://moodbeats.com/playlists/abc123"
      />
    </main>
  )
}
