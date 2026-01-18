'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Menu, LogOut, Zap, Music, BarChart3, Eye } from 'lucide-react'
import * as faceapi from 'face-api.js'

interface MoodAnalysis {
  dominant_mood: string
  mood_distribution: Record<string, number>
  total_moods: number
  avg_confidence: number
  days_analyzed: number
}

interface Track {
  name: string
  artist: string
  album: string
  preview_url: string | null
  uri: string
  image: string | null
}

interface PlaylistResult {
  success: boolean
  playlist: {
    id: string
    name: string
    url: string
    tracks_added: number
  }
  mood_analysis: MoodAnalysis
  dominant_mood: string
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentMood, setCurrentMood] = useState('Detecting...')
  const [confidence, setConfidence] = useState(0)

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  // Playlist states
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null)
  const [previewTracks, setPreviewTracks] = useState<Track[]>([])
  const [playlistResult, setPlaylistResult] = useState<PlaylistResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [days, setDays] = useState(7)
  const [numTracks, setNumTracks] = useState(20)

  const API_URL = 'http://127.0.0.1:5000'

  /* -------------------- AUTH (SAVE JWT FROM URL) -------------------- */
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('jwt', tokenFromUrl)
      router.replace('/dashboard')
      return
    }

    const token = localStorage.getItem('jwt')
    if (!token) router.replace('/')
    else setLoading(false)
  }, [router, searchParams])

  /* -------------------- START CAMERA -------------------- */
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraReady(true)
        }
      } catch (err) {
        console.error('Camera access denied', err)
      }
    }

    startCamera()
  }, [])

  /* -------------------- LOAD FACE-API MODELS -------------------- */
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL =
        'https://justadudewhohacks.github.io/face-api.js/models'

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

      console.log('✅ Face-api models loaded')
      setModelsLoaded(true)
    }

    loadModels()
  }, [])

  /* -------------------- EMOTION DETECTION LOOP -------------------- */
  useEffect(() => {
    if (!modelsLoaded || !cameraReady) return

    const detectEmotion = async () => {
      if (!videoRef.current) return

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions()

      if (!detection?.expressions) return

      const expressions = detection.expressions
      const emotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      )

      const conf = Math.round(expressions[emotion] * 100)

      setCurrentMood(emotion)
      setConfidence(conf)

      // 🔐 SEND TO BACKEND
      const token = localStorage.getItem('jwt')
      if (!token) return

      fetch('http://127.0.0.1:5000/api/emotion/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emotion,
          confidence: conf,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error)
    }

    intervalRef.current = setInterval(detectEmotion, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [modelsLoaded, cameraReady])

  /* -------------------- HELPER: GET AUTH HEADERS -------------------- */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  /* -------------------- ANALYZE MOODS -------------------- */
  const analyzeMoods = async () => {
    setPlaylistLoading(true)
    try {
      const response = await fetch(
        `${API_URL}/api/playlist/analyze-moods?days=${days}`,
        { headers: getAuthHeaders() }
      )

      if (!response.ok) throw new Error('Failed to analyze moods')

      const data = await response.json()
      setMoodAnalysis(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze moods. Make sure you have mood data.')
    } finally {
      setPlaylistLoading(false)
    }
  }

  /* -------------------- PREVIEW RECOMMENDATIONS -------------------- */
  const previewRecommendations = async () => {
    setPlaylistLoading(true)
    setShowPreview(true)
    try {
      const response = await fetch(
        `${API_URL}/api/playlist/preview-recommendations`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            days,
            num_tracks: numTracks,
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to get recommendations')

      const data = await response.json()
      setPreviewTracks(data.recommendations)
      setMoodAnalysis(data.mood_analysis)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get recommendations')
    } finally {
      setPlaylistLoading(false)
    }
  }

  /* -------------------- GENERATE PLAYLIST -------------------- */
  const generatePlaylist = async () => {
    setPlaylistLoading(true)
    setPlaylistResult(null)
    try {
      const response = await fetch(`${API_URL}/api/playlist/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          days,
          num_tracks: numTracks,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate playlist')

      const data = await response.json()
      setPlaylistResult(data)
      setMoodAnalysis(data.mood_analysis)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate playlist')
    } finally {
      setPlaylistLoading(false)
    }
  }

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    localStorage.removeItem('jwt')
    router.replace('/')
  }

  if (loading) return <p className="p-6">Loading dashboard…</p>

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} p-4 border-r transition-all`}>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full justify-start">
            <Menu />
            {sidebarOpen && <span className="ml-2">Menu</span>}
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
            <LogOut />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Your Mood Dashboard</h1>

        {/* Current Emotion & Camera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Current Emotion
            </h2>
            <p className="text-4xl font-bold text-primary mb-2 capitalize">
              {currentMood}
            </p>
            <p className="text-sm text-muted-foreground">
              Confidence: {confidence}%
            </p>
            <div className="mt-4 bg-secondary/20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Live Camera Feed</h2>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded-md border"
            />
          </Card>
        </div>

        {/* Playlist Generation Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Music className="w-6 h-6" />
            Playlist Generator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Days to Analyze
              </label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Tracks
              </label>
              <input
                type="number"
                value={numTracks}
                onChange={(e) => setNumTracks(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                min="5"
                max="50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={analyzeMoods}
              disabled={playlistLoading}
              variant="outline"
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analyze Moods
            </Button>
            <Button
              onClick={previewRecommendations}
              disabled={playlistLoading}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Tracks
            </Button>
            <Button
              size="lg"
              className="gap-2"
              onClick={generatePlaylist}
              disabled={playlistLoading}
            >
              <Zap className="w-4 h-4" />
              {playlistLoading ? 'Generating…' : 'Create Playlist'}
            </Button>
          </div>
        </Card>

        {/* Mood Analysis */}
        {moodAnalysis && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mood Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Dominant Mood</p>
                <p className="text-2xl font-bold capitalize text-primary">
                  {moodAnalysis.dominant_mood}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Moods</p>
                <p className="text-2xl font-bold">{moodAnalysis.total_moods}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Avg Confidence</p>
                <p className="text-2xl font-bold">
                  {moodAnalysis.avg_confidence?.toFixed(1)}%
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Days Analyzed</p>
                <p className="text-2xl font-bold">{moodAnalysis.days_analyzed}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-3">Mood Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(moodAnalysis.mood_distribution).map(
                  ([mood, count]) => (
                    <div
                      key={mood}
                      className="bg-secondary/30 rounded-lg p-3 text-center"
                    >
                      <div className="capitalize font-medium text-sm">{mood}</div>
                      <div className="text-3xl font-bold text-primary">{count}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Preview Tracks */}
        {showPreview && previewTracks.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recommended Tracks ({previewTracks.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {previewTracks.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{track.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {track.album}
                    </div>
                  </div>
                  {track.preview_url && (
                    <audio controls className="h-8">
                      <source src={track.preview_url} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Playlist Result */}
        {playlistResult && (
          <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
              <Music className="w-6 h-6" />
              ✅ Playlist Created Successfully!
            </h2>
            <div className="space-y-2 mb-4">
              <p>
                <strong>Name:</strong> {playlistResult.playlist.name}
              </p>
              <p>
                <strong>Tracks Added:</strong> {playlistResult.playlist.tracks_added}
              </p>
              <p>
                <strong>Based on Mood:</strong>{' '}
                <span className="capitalize font-semibold">
                  {playlistResult.dominant_mood}
                </span>
              </p>
            </div>
            <a
              href={playlistResult.playlist.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Music className="w-4 h-4" />
                Open in Spotify
              </Button>
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}