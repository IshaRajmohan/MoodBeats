"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, Wand2, Download, Plus, Zap } from "lucide-react"
//import LoadingAnimation from "@/components/loading-animation"

export default function TrackGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("lo-fi")
  const [genre, setGenre] = useState("ambient")
  const [instruments, setInstruments] = useState("piano")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTrack, setGeneratedTrack] = useState<{
    title: string
    duration: string
    bpm: number
    mood: string
    confidence: number
  } | null>(null)

  const styles = ["Lo-fi", "Electronic", "Acoustic", "Jazz", "Classical", "Ambient"]
  const genres = ["Ambient", "Chill", "Focus", "Sleep", "Energetic", "Atmospheric"]
  const instrumentOptions = ["Piano", "Guitar", "Strings", "Synth", "Drums", "Pads"]


  const analyzeEmotion = async (text: string) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/emotion/analyze-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true)
    const emotionResult = await analyzeEmotion(prompt);

    if (!emotionResult) {
      setIsGenerating(false);
      return;
      }
    // Simulate generation
    setTimeout(() => {
      setGeneratedTrack({
        title: `${prompt.split(" ").slice(0, 3).join(" ")} - AI Composition`,
        duration: "3:45",
        bpm: Math.floor(Math.random() * (140 - 60)) + 60,
        mood: emotionResult.label,        // 👈 Mood from backend
        confidence: Math.floor(emotionResult.score * 100), // 👈 Convert to %
      })
      setIsGenerating(false)
    }, 3000)
  }

  //if (isGenerating) {
   //return <LoadingAnimation message="Composing your track..." />
  //}

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Generate Track</h1>
          </div>
          <p className="text-muted-foreground">Create unique AI-composed music based on your mood and preferences</p>
        </div>

        {!generatedTrack ? (
          <div className="space-y-6">
            {/* Prompt Input */}
            <Card className="p-6 border-primary/10">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-foreground mb-2 block">What would you like to create?</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Lo-fi beats for late night coding, uplifting indie pop..."
                  className="w-full min-h-24 p-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </label>
            </Card>

            {/* Style Selector */}
            <Card className="p-6 border-primary/10">
              <h3 className="font-semibold text-foreground mb-4">Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s.toLowerCase())}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                      style === s.toLowerCase()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>

            {/* Genre Selector */}
            <Card className="p-6 border-primary/10">
              <h3 className="font-semibold text-foreground mb-4">Genre</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g.toLowerCase())}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                      genre === g.toLowerCase()
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-card text-foreground hover:border-accent/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Card>

            {/* Instruments Selector */}
            <Card className="p-6 border-primary/10">
              <h3 className="font-semibold text-foreground mb-4">Primary Instruments</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {instrumentOptions.map((inst) => (
                  <button
                    key={inst}
                    onClick={() => setInstruments(inst.toLowerCase())}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                      instruments === inst.toLowerCase()
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border bg-card text-foreground hover:border-secondary/50"
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate Button */}
            <Button size="lg" onClick={handleGenerate} disabled={!prompt.trim()} className="w-full">
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Track
            </Button>
          </div>
        ) : (
          <Card className="p-8 border-primary/10 space-y-6">
            {/* Track Preview */}
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{generatedTrack.title}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>{generatedTrack.duration}</span>
                  <span>•</span>
                  <span>{generatedTrack.bpm} BPM</span>
                </div>
              </div>
            </div>

            {/* Mood Match */}
            <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Mood Match</span>
                <span className="text-sm font-semibold text-accent">{generatedTrack.confidence}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${generatedTrack.confidence}%` }}
                />
              </div>
            </div>

            {/* Audio Player Placeholder */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </button>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">Preview Player</div>
                  <div className="w-64 h-1 bg-border rounded-full" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">3:45</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add to Playlist
              </Button>
            </div>

            {/* Generate Another */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setGeneratedTrack(null)
                setPrompt("")
              }}
              className="w-full gap-2"
            >
              <Zap className="w-5 h-5" />
              Generate Another
            </Button>
          </Card>
        )}
      </div>
    </main>
  )
}
