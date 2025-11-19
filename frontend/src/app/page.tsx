'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Music, Heart, Sparkles, Radio, Users, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const [isOnboarding, setIsOnboarding] = useState(false)

  if (isOnboarding) {
    return <OnboardingFlow onComplete={() => setIsOnboarding(false)} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">MoodBeats</span>
        </div>
        <Button variant="outline" onClick={() => setIsOnboarding(true)}>Sign In</Button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Music That<br /><span className="text-primary">Feels You</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                AI detects your mood through your camera and generates the perfect playlist just for this moment.
              </p>
            </div>
            <Button size="lg" className="w-fit" onClick={() => setIsOnboarding(true)}>
              Start Creating
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
            <Card className="relative bg-card/80 backdrop-blur-sm border-primary/10 overflow-hidden">
              <div className="aspect-square flex flex-col items-center justify-center gap-8 p-8">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Music className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Radio className="w-12 h-12 text-primary-foreground animate-pulse" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground text-lg">Create personalized playlists powered by emotion AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: 'Detect Mood', desc: 'AI reads your emotions in real-time through your camera' },
            { icon: Sparkles, title: 'Generate', desc: 'Create mood-matched playlists instantly with AI curation' },
            { icon: Users, title: 'Collaborate', desc: 'Share playlists and edit together with friends in real-time' },
          ].map((feature, i) => (
            <Card key={i} className="p-6 border-primary/10 hover:border-primary/30 transition-colors">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary p-12 text-center border-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent" />
          </div>
          <div className="relative space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">Ready to match your music?</h2>
            <Button size="lg" variant="secondary" onClick={() => setIsOnboarding(true)}>
              Get Started
            </Button>
          </div>
        </Card>
      </section>
    </main>
  )
}

function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to MoodBeats',
      desc: 'Let your emotions guide your music',
      icon: Music,
      action: 'Continue',
    },
    {
      title: 'Camera Access',
      desc: 'We analyze your emotions locally in real-time. Your privacy is our priority.',
      icon: Heart,
      action: 'Allow Camera',
    },
    {
      title: 'Connect Spotify',
      desc: 'Sync with your Spotify account to build and listen to your mood playlists',
      icon: Radio,
      action: 'Connect Spotify',
    },
  ]

  const CurrentIcon = steps[step].icon

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-primary/10">
        <div className="p-8 space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <CurrentIcon className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">{steps[step].title}</h2>
            <p className="text-muted-foreground">{steps[step].desc}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'bg-primary w-6' : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1)
                } else {
                  onComplete()
                }
              }}
            >
              {steps[step].action}
            </Button>
            {step > 0 && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </Card>
    </main>
  )
}
