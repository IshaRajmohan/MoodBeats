'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SettingsSection } from '@/components/settings-section'
import { ToggleSetting } from '@/components/toggle-setting'
import { Menu, Save, LogOut, Trash2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    cameraPrivacy: false,
    playlistPrivacy: 'private',
    notifications: true,
    emailDigest: true,
    dataCollection: false,
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggle = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

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
                  variant="ghost"
                  className="w-full justify-start"
                >
                  {item}
                </Button>
              ))}
            </nav>
            <div className="space-y-2 border-t border-border pt-4">
              <Button variant="default" className="w-full justify-start">
                Settings
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences</p>
          </div>

          {/* Profile Section */}
          <SettingsSection title="Profile" description="Update your public profile information">
            <div className="space-y-4">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl text-primary-foreground font-bold">
                    JD
                  </div>
                  <Button variant="outline">Upload Picture</Button>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Jane Doe"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  defaultValue="Music lover & playlist creator"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </SettingsSection>

          {/* Privacy Settings */}
          <SettingsSection title="Privacy & Permissions" description="Control how your data is used">
            <div className="space-y-4">
              <ToggleSetting
                label="Camera Privacy"
                description="Only analyze emotions locally on your device, never upload video"
                enabled={settings.cameraPrivacy}
                onChange={(val) => handleToggle('cameraPrivacy', val)}
              />
              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Playlist Privacy
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'private', label: 'Private - Only you can see' },
                    { value: 'friends', label: 'Friends Only - Share with collaborators' },
                    { value: 'public', label: 'Public - Anyone can discover' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        value={option.value}
                        checked={settings.playlistPrivacy === option.value}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            playlistPrivacy: option.value,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications" description="Control how we communicate with you">
            <div className="space-y-4">
              <ToggleSetting
                label="Push Notifications"
                description="Get notified when collaborators join or make changes"
                enabled={settings.notifications}
                onChange={(val) => handleToggle('notifications', val)}
              />
              <div className="border-t border-border pt-4">
                <ToggleSetting
                  label="Weekly Email Digest"
                  description="Receive a summary of your mood trends and top playlists"
                  enabled={settings.emailDigest}
                  onChange={(val) => handleToggle('emailDigest', val)}
                />
              </div>
            </div>
          </SettingsSection>

          {/* Connected Accounts */}
          <SettingsSection title="Connected Accounts" description="Manage your integrations">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium text-foreground">Spotify</p>
                  <p className="text-sm text-green-600">Connected</p>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Data & Privacy */}
          <SettingsSection title="Data & Privacy" description="Manage your personal data">
            <div className="space-y-4">
              <ToggleSetting
                label="Help Improve MoodBeats"
                description="Allow anonymized mood data to improve AI accuracy"
                enabled={settings.dataCollection}
                onChange={(val) => handleToggle('dataCollection', val)}
              />
              <div className="border-t border-border pt-4 space-y-3">
                <Button variant="outline" className="w-full justify-center">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-center">
                  GDPR Compliance Report
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection title="Danger Zone" description="Irreversible actions">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                Sign Out of All Devices
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </SettingsSection>

          {/* Save Changes */}
          <div className="flex gap-3 sticky bottom-6">
            <Button size="lg" className="gap-2">
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
            <Button size="lg" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-primary/10">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Delete Account?</h2>
                  <p className="text-sm text-muted-foreground">This cannot be undone</p>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded text-sm text-foreground space-y-1">
                <p className="font-medium">This will:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Delete your profile and all playlists</li>
                  <li>Remove you from collaborative playlists</li>
                  <li>Permanently delete your mood history</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button variant="destructive" className="w-full">
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
