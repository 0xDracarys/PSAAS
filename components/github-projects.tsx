"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Star, GitFork, Eye, ExternalLink, Calendar, Code2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GitHubRepo {
  id: number
  name: string
  title: string
  description: string
  url: string
  homepage: string | null
  stars: number
  forks: number
  watchers: number
  language: string | null
  topics: string[]
  createdAt: string
  updatedAt: string
  size: number
  isPrivate: boolean
}

export function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("updated")
  const [filterLanguage, setFilterLanguage] = useState("all")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Fetch GitHub repos
  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        const response = await fetch(`/api/github/repos?sort=${sortBy}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.repos) {
            setRepos(data.repos)
            setFilteredRepos(data.repos)
          }
        }
      } catch (error) {
        console.error('Error fetching GitHub repos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGitHubRepos()
  }, [sortBy])

  // Get unique languages
  const languages = ["all", ...new Set(repos.map(repo => repo.language).filter(Boolean))]

  // Filter repos by language
  useEffect(() => {
    if (filterLanguage === "all") {
      setFilteredRepos(repos)
    } else {
      setFilteredRepos(repos.filter(repo => repo.language === filterLanguage))
    }
  }, [filterLanguage, repos])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <section ref={ref} className="py-20 px-4 relative bg-gradient-to-br from-muted/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            <Github className="inline-block h-10 w-10 mr-3 text-primary" />
            GitHub <span className="text-primary text-glow">Repositories</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            Explore all my open-source projects and contributions on GitHub. 
            Automatically synced with my latest work.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] glassmorphism">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="created">Recently Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[140px] glassmorphism">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang === "all" ? "All Languages" : lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Badge variant="secondary" className="glassmorphism">
              {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'}
            </Badge>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading repositories from GitHub...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glassmorphism bg-card/10 border-border/30 h-full flex flex-col hover:glow-amber transition-all duration-300 group">
                    <div className="p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <Code2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-1">
                            {repo.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {repo.description}
                      </p>

                      {/* Topics/Tags */}
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {repo.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{repo.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{repo.stars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>{repo.forks}</span>
                        </div>
                      </div>

                      {/* Updated Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {formatDate(repo.updatedAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 glassmorphism hover:glow-amber"
                          asChild
                        >
                          <a href={repo.url} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            View Code
                          </a>
                        </Button>
                        {repo.homepage && (
                          <Button
                            size="sm"
                            className="glow hover:glow-amber"
                            asChild
                          >
                            <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* View All on GitHub */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                className="glow hover:glow-amber transition-all duration-300"
                asChild
              >
                <a href="https://github.com/0xDracarys" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 mr-2" />
                  View All Repositories on GitHub
                </a>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
