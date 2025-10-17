"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Github, Eye, EyeOff, Lock, Globe, Settings, Save, RefreshCcw, Trash2, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GitHubRepo {
  id: number
  name: string
  title: string
  description: string
  url: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  isPrivate: boolean
  category?: string
}

interface ProjectSettings {
  repoId: number
  repoName: string
  visibility: 'public' | 'private' | 'hidden'
  category: string
  customTitle?: string
  customDescription?: string
  featured?: boolean
  displayOrder?: number
  tags?: string[]
}

const categories = [
  "Security & Cybersecurity",
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Data Science & Analytics",
  "DevOps & Infrastructure",
  "Blockchain & Web3",
  "Game Development",
  "API & Backend Services",
  "Tools & Utilities",
  "Educational & Tutorials",
  "Portfolio & Personal",
  "Other"
]

export function GitHubProjectManager() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [settings, setSettings] = useState<Map<number, ProjectSettings>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const { toast } = useToast()

  // Fetch GitHub repos and their settings
  useEffect(() => {
    fetchReposAndSettings()
  }, [])

  const fetchReposAndSettings = async () => {
    try {
      setLoading(true)
      
      // Fetch repos from GitHub
      const reposResponse = await fetch('/api/github/repos?username=0xDracarys')
      const reposData = await reposResponse.json()
      
      if (!reposData.success) {
        throw new Error('Failed to fetch repositories')
      }

      // Auto-categorize repos
      const categorizeResponse = await fetch('/api/github/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos: reposData.repos }),
      })
      const categorizedData = await categorizeResponse.json()
      
      setRepos(categorizedData.repos || reposData.repos)

      // Fetch existing settings
      const settingsResponse = await fetch('/api/github/manage')
      const settingsData = await settingsResponse.json()
      
      if (settingsData.success && settingsData.settings) {
        const settingsMap = new Map()
        const settingsArray = Array.isArray(settingsData.settings) 
          ? settingsData.settings 
          : [settingsData.settings]
        
        settingsArray.forEach((setting: ProjectSettings) => {
          settingsMap.set(setting.repoId, setting)
        })
        setSettings(settingsMap)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load GitHub repositories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRepoSettings = (repoId: number): ProjectSettings => {
    return settings.get(repoId) || {
      repoId,
      repoName: repos.find(r => r.id === repoId)?.name || '',
      visibility: 'public',
      category: repos.find(r => r.id === repoId)?.category || 'Other',
      featured: false,
      displayOrder: 0,
      tags: [],
    }
  }

  const saveSettings = async (repoId: number, newSettings: Partial<ProjectSettings>) => {
    try {
      setSaving(repoId)
      const repo = repos.find(r => r.id === repoId)
      if (!repo) return

      const currentSettings = getRepoSettings(repoId)
      const updatedSettings = { ...currentSettings, ...newSettings, repoId, repoName: repo.name }

      const response = await fetch('/api/github/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })

      const data = await response.json()

      if (data.success) {
        setSettings(prev => new Map(prev).set(repoId, updatedSettings))
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        throw new Error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const toggleVisibility = (repoId: number) => {
    const currentSettings = getRepoSettings(repoId)
    const visibilityStates: Array<'public' | 'private' | 'hidden'> = ['public', 'private', 'hidden']
    const currentIndex = visibilityStates.indexOf(currentSettings.visibility)
    const nextVisibility = visibilityStates[(currentIndex + 1) % visibilityStates.length]
    saveSettings(repoId, { visibility: nextVisibility })
  }

  const toggleFeatured = (repoId: number) => {
    const currentSettings = getRepoSettings(repoId)
    saveSettings(repoId, { featured: !currentSettings.featured })
  }

  const resetSettings = async (repoId: number) => {
    try {
      setSaving(repoId)
      const response = await fetch(`/api/github/manage?repoId=${repoId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSettings(prev => {
          const newSettings = new Map(prev)
          newSettings.delete(repoId)
          return newSettings
        })
        toast({
          title: "Success",
          description: "Settings reset to default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />
      case 'private': return <Lock className="h-4 w-4" />
      case 'hidden': return <EyeOff className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'bg-green-500'
      case 'private': return 'bg-yellow-500'
      case 'hidden': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">GitHub Project Manager</h2>
          <p className="text-muted-foreground mt-2">
            Manage visibility, categories, and settings for your GitHub repositories
          </p>
        </div>
        <Button onClick={fetchReposAndSettings} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {repos.map((repo) => {
          const repoSettings = getRepoSettings(repo.id)
          
          return (
            <Card key={repo.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{repo.title}</CardTitle>
                      {repoSettings.featured && (
                        <Badge variant="default" className="bg-amber-500">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline" className={getVisibilityColor(repoSettings.visibility)}>
                        {getVisibilityIcon(repoSettings.visibility)}
                        <span className="ml-1 text-white capitalize">{repoSettings.visibility}</span>
                      </Badge>
                      <Badge variant="secondary">{repoSettings.category}</Badge>
                    </div>
                    <CardDescription>{repo.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Github className="h-3 w-3" />
                        {repo.name}
                      </span>
                      {repo.language && (
                        <span>{repo.language}</span>
                      )}
                      <span>⭐ {repo.stars}</span>
                      <span>🔱 {repo.forks}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVisibility(repo.id)}
                      disabled={saving === repo.id}
                    >
                      {getVisibilityIcon(repoSettings.visibility)}
                      <span className="ml-2">Toggle Visibility</span>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRepo(repo)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customize Repository Settings</DialogTitle>
                          <DialogDescription>
                            Configure custom settings for {repo.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Visibility</Label>
                              <Select
                                value={repoSettings.visibility}
                                onValueChange={(value: any) => saveSettings(repo.id, { visibility: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="public">🌐 Public (Shown on website)</SelectItem>
                                  <SelectItem value="private">🔒 Private (Admin only)</SelectItem>
                                  <SelectItem value="hidden">👁️ Hidden (Don't show)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select
                                value={repoSettings.category}
                                onValueChange={(value) => saveSettings(repo.id, { category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Custom Title (Optional)</Label>
                            <Input
                              placeholder={repo.title}
                              value={repoSettings.customTitle || ''}
                              onChange={(e) => saveSettings(repo.id, { customTitle: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Custom Description (Optional)</Label>
                            <Textarea
                              placeholder={repo.description}
                              value={repoSettings.customDescription || ''}
                              onChange={(e) => saveSettings(repo.id, { customDescription: e.target.value })}
                              rows={3}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Featured Project</Label>
                              <p className="text-sm text-muted-foreground">
                                Show this project prominently on your website
                              </p>
                            </div>
                            <Switch
                              checked={repoSettings.featured || false}
                              onCheckedChange={() => toggleFeatured(repo.id)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Display Order</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={repoSettings.displayOrder || 0}
                              onChange={(e) => saveSettings(repo.id, { displayOrder: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                              Lower numbers appear first. Default is 0.
                            </p>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => resetSettings(repo.id)}
                              disabled={saving === repo.id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Reset to Default
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>

              {repo.topics.length > 0 && (
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        #{topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {repos.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No GitHub repositories found</p>
          </div>
        </Card>
      )}
    </div>
  )
}
