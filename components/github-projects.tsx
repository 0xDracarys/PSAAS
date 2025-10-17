"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Star, GitFork, Eye, ExternalLink, Calendar, Code2, TrendingUp, Activity, Zap } from "lucide-react"
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
  category?: string
  visibility?: 'public' | 'private' | 'hidden'
  customTitle?: string
  customDescription?: string
  featured?: boolean
}

// Language color mapping
const languageColors: { [key: string]: string } = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb",
}

// 3D Tilt Card Component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      
      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])
  
  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("updated")
  const [filterLanguage, setFilterLanguage] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [totalStats, setTotalStats] = useState({ stars: 0, forks: 0, repos: 0 })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Fetch GitHub repos with settings
  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        // Fetch repos from GitHub
        const reposResponse = await fetch(`/api/github/repos?sort=${sortBy}`)
        if (!reposResponse.ok) throw new Error('Failed to fetch repos')
        
        const reposData = await reposResponse.json()
        if (!reposData.success || !reposData.repos) throw new Error('Invalid repos data')

        // Auto-categorize repos
        const categorizeResponse = await fetch('/api/github/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repos: reposData.repos }),
        })
        const categorizedData = await categorizeResponse.json()
        let reposWithCategories = categorizedData.success ? categorizedData.repos : reposData.repos

        // Fetch ALL visibility settings (not just public)
        const settingsResponse = await fetch('/api/github/manage')
        const settingsData = await settingsResponse.json()
        
        // Apply settings to repos
        const settingsArray = settingsData.success && settingsData.settings
          ? (Array.isArray(settingsData.settings) ? settingsData.settings : [settingsData.settings])
          : []
        
        const settingsMap = new Map()
        settingsArray.forEach((setting: any) => {
          if (setting && setting.repoId) {
            settingsMap.set(setting.repoId, setting)
          }
        })

        reposWithCategories = reposWithCategories.map((repo: GitHubRepo) => {
          const settings = settingsMap.get(repo.id)
          if (settings) {
            return {
              ...repo,
              category: settings.category || repo.category,
              visibility: settings.visibility || 'public',
              customTitle: settings.customTitle,
              customDescription: settings.customDescription,
              featured: settings.featured || false,
              title: settings.customTitle || repo.title,
              description: settings.customDescription || repo.description,
            }
          }
          // Default: show all repos as public if no settings exist
          return { ...repo, visibility: 'public' }
        })

        // Filter out hidden repos (only show public ones on the website)
        const publicRepos = reposWithCategories.filter((repo: GitHubRepo) => 
          repo.visibility !== 'hidden' && repo.visibility !== 'private'
        )

        setRepos(publicRepos)
        setFilteredRepos(publicRepos)
            
        // Calculate total stats
        const stats = publicRepos.reduce((acc: any, repo: GitHubRepo) => ({
          stars: acc.stars + repo.stars,
          forks: acc.forks + repo.forks,
          repos: acc.repos + 1
        }), { stars: 0, forks: 0, repos: 0 })
        
        setTotalStats(stats)
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

  // Get unique categories
  const categories = ["all", ...new Set(repos.map(repo => repo.category).filter(Boolean))]

  // Get language distribution
  const languageDistribution = repos.reduce((acc: { [key: string]: number }, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1
    }
    return acc
  }, {})
  
  const topLanguages = Object.entries(languageDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Filter repos by language and category
  useEffect(() => {
    let filtered = repos

    if (filterLanguage !== "all") {
      filtered = filtered.filter(repo => repo.language === filterLanguage)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(repo => repo.category === filterCategory)
    }

    setFilteredRepos(filtered)
  }, [filterLanguage, filterCategory, repos])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <section ref={ref} className="py-20 px-4 relative bg-gradient-to-br from-background via-muted/5 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-50 animate-pulse"></div>
              <Github className="relative h-16 w-16 text-primary mx-auto" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">
            GitHub <span className="text-primary text-glow bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">Repositories</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            🚀 Explore my open-source journey • Building in public • Always learning
          </p>

          {/* GitHub Profile Stats Cards */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
            >
              {/* Total Repositories */}
              <Card className="glassmorphism bg-gradient-to-br from-primary/10 to-transparent border-primary/20 p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Repositories</p>
                    <p className="text-3xl font-bold text-primary">
                      <AnimatedCounter value={totalStats.repos} />
                    </p>
                  </div>
                  <Code2 className="h-8 w-8 text-primary/50" />
                </div>
              </Card>

              {/* Total Stars */}
              <Card className="glassmorphism bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Stars</p>
                    <p className="text-3xl font-bold text-secondary">
                      <AnimatedCounter value={totalStats.stars} />
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-secondary/50 fill-secondary/50" />
                </div>
              </Card>

              {/* Total Forks */}
              <Card className="glassmorphism bg-gradient-to-br from-accent/10 to-transparent border-accent/20 p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Forks</p>
                    <p className="text-3xl font-bold text-accent">
                      <AnimatedCounter value={totalStats.forks} />
                    </p>
                  </div>
                  <GitFork className="h-8 w-8 text-accent/50" />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Top Languages Bar */}
          {!isLoading && topLanguages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="flex items-center gap-4 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">Top Languages</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {topLanguages.map(([lang, count]) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="glassmorphism border-border/50 hover:scale-105 transition-transform whitespace-nowrap"
                    style={{
                      borderColor: languageColors[lang] || '#888',
                      background: `${languageColors[lang] || '#888'}15`
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: languageColors[lang] || '#888' }}
                    />
                    {lang} ({count})
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] glassmorphism border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">🔄 Last Updated</SelectItem>
                  <SelectItem value="stars">⭐ Most Stars</SelectItem>
                  <SelectItem value="created">🆕 Recently Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground font-medium">Language:</span>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[160px] glassmorphism border-secondary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang === "all" ? "🌐 All Languages" : `💻 ${lang}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground font-medium">Category:</span>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px] glassmorphism border-amber-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "📁 All Categories" : `🗂️ ${cat}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Badge variant="secondary" className="glassmorphism bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
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
            {/* Repositories Grid with 3D Tilt Effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="perspective-1000"
                >
                  <TiltCard className="h-full">
                    <Card className="glassmorphism bg-gradient-to-br from-card/80 to-card/20 border-border/30 h-full flex flex-col hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group relative overflow-hidden">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Spotlight effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                      
                      <div className="relative p-6 flex flex-col flex-1" style={{ transform: "translateZ(50px)" }}>
                        {/* Header with Pulse Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="relative">
                              <Code2 className="h-5 w-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                              </span>
                            </div>
                            <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {repo.title}
                            </h3>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            {repo.category && (
                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 whitespace-nowrap">
                                🗂️ {repo.category}
                              </Badge>
                            )}
                            {repo.featured && (
                              <Badge variant="default" className="text-xs bg-gradient-to-r from-amber-500 to-orange-500">
                                <Star className="h-3 w-3 mr-1 fill-white" />
                                Featured
                              </Badge>
                            )}
                            {repo.stars > 0 && (
                              <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-400 font-bold">
                                <Star className="h-3 w-3 mr-1 fill-amber-400" />
                                {repo.stars}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Description with gradient text on hover */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 group-hover:text-foreground/80 transition-colors">
                          {repo.description}
                        </p>

                        {/* Topics/Tags with animated background */}
                        {repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {repo.topics.slice(0, 4).map((topic, i) => (
                              <Badge 
                                key={topic} 
                                variant="outline" 
                                className="text-xs glassmorphism hover:bg-primary/20 hover:border-primary/50 hover:scale-110 transition-all cursor-default"
                                style={{
                                  animationDelay: `${i * 100}ms`
                                }}
                              >
                                #{topic}
                              </Badge>
                            ))}
                            {repo.topics.length > 4 && (
                              <Badge variant="outline" className="text-xs glassmorphism hover:bg-secondary/20 hover:border-secondary/50 transition-all">
                                +{repo.topics.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats with animated counters */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4 pb-4 border-b border-border/30">
                          {repo.language && (
                            <div className="flex items-center gap-1.5 group/lang hover:scale-105 transition-transform">
                              <div 
                                className="w-3 h-3 rounded-full shadow-lg"
                                style={{ 
                                  backgroundColor: languageColors[repo.language] || '#888',
                                  boxShadow: `0 0 10px ${languageColors[repo.language] || '#888'}50`
                                }}
                              ></div>
                              <span className="text-muted-foreground group-hover/lang:text-foreground transition-colors font-medium">{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default">
                            <GitFork className="h-4 w-4 text-blue-400" />
                            <span className="text-muted-foreground font-medium">{repo.forks}</span>
                          </div>
                          <div className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default">
                            <Eye className="h-4 w-4 text-green-400" />
                            <span className="text-muted-foreground font-medium">{repo.watchers}</span>
                          </div>
                        </div>

                        {/* Updated Date with icon animation */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                          <Calendar className="h-3 w-3 group-hover:text-primary group-hover:animate-pulse" />
                          <span className="group-hover:text-foreground/70 transition-colors">
                            Updated {formatDate(repo.updatedAt)}
                          </span>
                        </div>

                        {/* Actions with hover effects */}
                        <div className="flex gap-2 mt-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 glassmorphism hover:bg-primary/20 hover:border-primary hover:text-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
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
                              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
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
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {/* View All on GitHub with Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-16 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl"></div>
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 text-white hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 group text-lg px-8 py-6"
                asChild
              >
                <a href="https://github.com/0xDracarys" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <Github className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  <span>Explore Full GitHub Profile</span>
                  <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </>
        )}
      </div>
      
      {/* Add custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        .bg-size-200 {
          background-size: 200%;
        }
        .bg-pos-100 {
          background-position: 100%;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
