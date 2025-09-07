"use client"

import React, { useState, useEffect, useCallback, useMemo, ErrorBoundary } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  BarChart3,
  Users,
  FolderOpen,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Settings,
  LogOut,
  Palette,
  Check,
  Copy,
  History,
  X,
  Save,
  Upload,
  FileText,
  BookOpen,
  Code,
  RefreshCw,
  HelpCircle,
} from "lucide-react"

// Types for API data
interface Project {
  _id: string
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo: string
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Admin dashboard specific fields
  client: string
  status: "completed" | "in-progress" | "pending"
  budget: number
  startDate: string
  endDate: string
  progress: number
}

interface ClientRequest {
  _id: string
  name: string
  email: string
  phone: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
  referenceLinks?: string[]
  files?: string[]
  acceptedTerms: boolean
  paymentTerms: string
  createdAt: string
  status: "pending" | "reviewed" | "approved" | "rejected"
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: "admin", password: "admin123" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) {
      return
    }
    
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success) {
        onLogin()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 shadow-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-8"
          >
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Secure access to project management</p>
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Default Credentials:</strong><br />
                Username: <code className="bg-blue-500/20 px-1 rounded">admin</code><br />
                Password: <code className="bg-blue-500/20 px-1 rounded">admin123</code>
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter username"
                  className="glassmorphism bg-input/50 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter password"
                  className="glassmorphism bg-input/50 pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full glow hover:glow-amber transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Secure Login
                </>
              )}
            </Button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Protected by advanced encryption</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

function DashboardStats({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [stats, setStats] = useState([
    { title: "Active Projects", value: "0", change: "Loading...", icon: FolderOpen, color: "text-primary" },
    { title: "Client Requests", value: "0", change: "Loading...", icon: MessageSquare, color: "text-secondary" },
    { title: "Revenue (YTD)", value: "€0", change: "Loading...", icon: BarChart3, color: "text-primary" },
    { title: "Client Satisfaction", value: "0%", change: "Loading...", icon: Users, color: "text-secondary" },
  ])


  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects and requests in parallel with debouncing
        const [projectsData, requestsData] = await Promise.all([
          debouncedFetch('/api/projects', 500),
          debouncedFetch('/api/client-requests', 500)
        ])

        if (projectsData && requestsData) {
          const projects = projectsData.projects || []
          const requests = requestsData.requests || []

          // Calculate stats
          const activeProjects = projects.filter(p => p.isActive).length
          const totalRequests = requests.length
          const pendingRequests = requests.filter(r => r.status === 'pending').length
          const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
          const approvedRequests = requests.filter(r => r.status === 'approved').length
          const satisfactionRate = totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0

          setStats([
            {
              title: "Active Projects",
              value: activeProjects.toString(),
              change: `${projects.length} total projects`,
              icon: FolderOpen,
              color: "text-primary",
            },
            {
              title: "Client Requests",
              value: totalRequests.toString(),
              change: `${pendingRequests} pending`,
              icon: MessageSquare,
              color: "text-secondary",
            },
            {
              title: "Revenue (YTD)",
              value: `€${totalRevenue.toLocaleString()}`,
              change: "Total project value",
              icon: BarChart3,
              color: "text-primary",
            },
            {
              title: "Client Satisfaction",
              value: `${satisfactionRate}%`,
              change: "Approval rate",
              icon: Users,
              color: "text-secondary",
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [debouncedFetch])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 group shadow-lg hover:shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1 font-medium">{stat.title}</p>
                <p className="text-2xl font-serif font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function ProjectsTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await debouncedFetch('/api/projects', 300)
        if (data) {
          console.log('Fetched projects:', data.projects)
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [debouncedFetch])

  // Handle project creation
  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Project created:', data)
        // Refresh projects list
        const fetchResponse = await fetch('/api/projects')
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json()
          setProjects(fetchData.projects || [])
        }
        alert('Project created successfully!')
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    }
  }

  // Handle project update
  const handleUpdateProject = async (projectId: string, projectData: any) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Project updated:', data)
        // Refresh projects list
        const fetchResponse = await fetch('/api/projects')
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json()
          setProjects(fetchData.projects || [])
        }
        alert('Project updated successfully!')
      } else {
        alert('Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project')
    }
  }

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Project deleted:', data)
        // Refresh projects list
        const fetchResponse = await fetch('/api/projects')
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json()
          setProjects(fetchData.projects || [])
        }
        alert('Project deleted successfully!')
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (project.client?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glassmorphism bg-slate-800/50 backdrop-blur-md border border-slate-700/50 pl-10 w-64 shadow-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glassmorphism bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <Dialog>
          <DialogTrigger className="glow hover:glow-amber transition-all duration-300 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </DialogTrigger>
          <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              project={null} 
              onSave={handleCreateProject}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria." 
              : "Get started by creating your first project."}
          </p>
        </div>
      )}

      {/* Projects Table */}
      {!isLoading && filteredProjects.length > 0 && (
        <Card className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id} className="border-border/30">
                <TableCell className="font-medium">{project.title || 'Untitled'}</TableCell>
                <TableCell>{project.client || 'Unknown Client'}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>{project.budget}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(project.startDate).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">to {new Date(project.endDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                        <Edit className="h-4 w-4" />
                      </DialogTrigger>
                      <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Project</DialogTitle>
                        </DialogHeader>
                        <ProjectForm 
                          project={project} 
                          onSave={(projectData) => handleUpdateProject(project._id || project.id, projectData)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this project?')) {
                          handleDeleteProject(project._id || project.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}
    </div>
  )
}

function ClientRequestsTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [requests, setRequests] = useState<ClientRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClientRequests()
  }, [debouncedFetch])

  const fetchClientRequests = async () => {
    try {
      const data = await debouncedFetch('/api/client-requests', 300)
      if (data && data.success) {
        console.log('Fetched client requests:', data.requests)
        setRequests(data.requests)
      }
    } catch (error) {
      console.error('Error fetching client requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: ClientRequest['status']) => {
    try {
      const response = await fetch(`/api/client-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req._id === id ? { ...req, status } : req
        ))
      }
    } catch (error) {
      console.error('Error updating request status:', error)
    }
  }

  const handleUpdateRequest = async (id: string, requestData: any) => {
    try {
      const response = await fetch(`/api/client-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      
      if (response.ok) {
        // Refresh the requests list
        await fetchClientRequests()
        alert('Client request updated successfully!')
      } else {
        alert('Failed to update client request')
      }
    } catch (error) {
      console.error('Error updating client request:', error)
      alert('Failed to update client request')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pending</Badge>
      case "reviewed":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reviewed</Badge>
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      (request.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.projectType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glassmorphism bg-slate-800/50 backdrop-blur-md border border-slate-700/50 pl-10 w-64 shadow-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glassmorphism bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <Button variant="outline" className="glassmorphism bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Requests Table */}
      <Card className="glassmorphism bg-white/25 backdrop-blur-md border border-blue-200/40 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead>Client</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                    Loading requests...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No client requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request._id} className="border-border/30">
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.name || 'Unknown Name'}</div>
                      <div className="text-sm text-muted-foreground">{request.email || 'No Email'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.projectType || 'Unknown Type'}</TableCell>
                  <TableCell>{request.budget || 'Not specified'}</TableCell>
                  <TableCell>{request.timeline || 'Not specified'}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{new Date(request.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                        <Eye className="h-4 w-4" />
                      </DialogTrigger>
                      <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Client Request Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <p className="font-medium">{request.name || 'Unknown Name'}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="font-medium">{request.email || 'No Email'}</p>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <p className="font-medium">{request.phone || 'No Phone'}</p>
                            </div>
                            <div>
                              <Label>Project Type</Label>
                              <p className="font-medium">{request.projectType || 'Unknown Type'}</p>
                            </div>
                            <div>
                              <Label>Budget</Label>
                              <p className="font-medium">{request.budget}</p>
                            </div>
                            <div>
                              <Label>Timeline</Label>
                              <p className="font-medium">{request.timeline}</p>
                            </div>
                          </div>
                          <div>
                            <Label>Requirements</Label>
                            <p className="text-sm text-muted-foreground mt-1">{request.requirements}</p>
                          </div>
                          {request.referenceLinks && request.referenceLinks.length > 0 && (
                            <div>
                              <Label>Reference Links</Label>
                              <div className="mt-1 space-y-1">
                                {request.referenceLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline block"
                                  >
                                    {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 pt-4">
                            <Button 
                              onClick={() => updateRequestStatus(request._id || request.id, 'reviewed')}
                              disabled={request.status === 'reviewed'}
                            >
                              Mark as Reviewed
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => updateRequestStatus(request._id || request.id, 'approved')}
                              disabled={request.status === 'approved'}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => updateRequestStatus(request._id || request.id, 'rejected')}
                              disabled={request.status === 'rejected'}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                        <Edit className="h-4 w-4" />
                      </DialogTrigger>
                      <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Client Request</DialogTitle>
                        </DialogHeader>
                        <ClientRequestForm 
                          request={request} 
                          onSave={(requestData) => handleUpdateRequest(request._id || request.id, requestData)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function ProjectForm({ project, onSave }: { project: Project | null, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    tags: project?.tags?.join(', ') || '',
    github: project?.github || '',
    demo: project?.demo || '',
    features: project?.features?.join('\n') || '',
    isActive: project?.isActive ?? true,
    client: project?.client || '',
    status: project?.status || 'pending',
    budget: project?.budget || 0,
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    progress: project?.progress || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const projectData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      features: formData.features.split('\n').map(feature => feature.trim()).filter(feature => feature),
    }
    onSave(projectData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({...formData, client: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => setFormData({...formData, github: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="demo">Demo URL</Label>
          <Input
            id="demo"
            value={formData.demo}
            onChange={(e) => setFormData({...formData, demo: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
            className="glassmorphism bg-slate-800/50 rounded-md px-3 py-2 w-full"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="glassmorphism bg-slate-800/50"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="glassmorphism bg-slate-800/50 min-h-[100px]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="React, Node.js, MongoDB"
          className="glassmorphism bg-slate-800/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({...formData, features: e.target.value})}
          className="glassmorphism bg-slate-800/50 min-h-[100px]"
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded"
        />
        <Label htmlFor="isActive">Active Project</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="glow hover:glow-amber transition-all duration-300">
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

function WebsiteSettingsTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings(data.settings)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updatedSettings: any) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })

      if (response.ok) {
        setSettings(updatedSettings)
        // Dispatch custom event to notify main page of changes
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: updatedSettings }))
        alert('Settings updated successfully!')
      } else {
        alert('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Error updating settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Simple debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((settingsToSave: any) => {
      updateSettings(settingsToSave)
    }, 1000),
    []
  )

  const handleProfileUpdate = (field: string, value: string) => {
    if (!settings) return
    const updatedSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        [field]: value
      }
    }
    setSettings(updatedSettings)
    // Remove auto-save - only save when button is clicked
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'profile-image')

      // Upload file to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        // Update profile image URL
        handleProfileUpdate('profileImage', data.url)
        alert('Profile image uploaded successfully!')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading image')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading settings...</span>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Settings not found</h3>
        <p className="text-muted-foreground">Unable to load website settings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Website Settings</h2>
        <Button 
          onClick={() => updateSettings(settings)}
          disabled={isSaving}
          className="glow hover:glow-amber transition-all duration-300"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={settings.profile.name}
              onChange={(e) => handleProfileUpdate('name', e.target.value)}
              className="glassmorphism bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={settings.profile.title}
              onChange={(e) => handleProfileUpdate('title', e.target.value)}
              className="glassmorphism bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={settings.profile.email}
              onChange={(e) => handleProfileUpdate('email', e.target.value)}
              className="glassmorphism bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={settings.profile.phone}
              onChange={(e) => handleProfileUpdate('phone', e.target.value)}
              className="glassmorphism bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={settings.profile.location}
              onChange={(e) => handleProfileUpdate('location', e.target.value)}
              className="glassmorphism bg-slate-800/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={settings.profile.profileImage || "/hero-img.jpeg"}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                >
                  Upload Image
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Label htmlFor="profileImageUrl">Or enter image URL</Label>
              <Input
                id="profileImageUrl"
                value={settings.profile.profileImage}
                onChange={(e) => handleProfileUpdate('profileImage', e.target.value)}
                className="glassmorphism bg-slate-800/50 mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={settings.profile.bio}
            onChange={(e) => handleProfileUpdate('bio', e.target.value)}
            className="glassmorphism bg-slate-800/50 min-h-[100px]"
            placeholder="Tell your story..."
          />
        </div>
      </Card>

      {/* Experience Settings */}
      <Card className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Professional Experience</h3>
        <div className="space-y-4">
          {settings.experience.map((exp: any, index: number) => (
            <div key={index} className="glassmorphism bg-slate-800/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    value={exp.year}
                    onChange={(e) => {
                      const newExp = [...settings.experience]
                      newExp[index].year = e.target.value
                      setSettings(prev => ({...prev, experience: newExp}))
                    }}
                    className="glassmorphism bg-slate-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...settings.experience]
                      newExp[index].company = e.target.value
                      setSettings(prev => ({...prev, experience: newExp}))
                    }}
                    className="glassmorphism bg-slate-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...settings.experience]
                      newExp[index].title = e.target.value
                      setSettings(prev => ({...prev, experience: newExp}))
                    }}
                    className="glassmorphism bg-slate-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...settings.experience]
                      newExp[index].description = e.target.value
                      setSettings(prev => ({...prev, experience: newExp}))
                    }}
                    className="glassmorphism bg-slate-700/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  // Shared debounced fetch function for all components
  const debouncedFetch = useMemo(() => {
    const cache = new Map()
    const pending = new Map()
    
    return (url: string, delay: number = 1000) => {
      return new Promise((resolve) => {
        // Check cache first
        if (cache.has(url)) {
          const { data, timestamp } = cache.get(url)
          if (Date.now() - timestamp < 5000) { // 5 second cache
            resolve(data)
            return
          }
        }
        
        // Check if request is already pending
        if (pending.has(url)) {
          pending.get(url).push(resolve)
          return
        }
        
        // Create new pending request
        const resolvers = [resolve]
        pending.set(url, resolvers)
        
        setTimeout(async () => {
          try {
            const response = await fetch(url)
            if (response.ok) {
              const data = await response.json()
              // Cache the result
              cache.set(url, { data, timestamp: Date.now() })
              // Resolve all pending requests
              resolvers.forEach(res => res(data))
            } else {
              console.warn(`API call failed: ${url} - ${response.status}`)
              resolvers.forEach(res => res(null))
            }
          } catch (error) {
            console.error(`API call error: ${url}`, error)
            resolvers.forEach(res => res(null))
          } finally {
            pending.delete(url)
          }
        }, delay)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative glassmorphism bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Project Management Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Switch to settings tab
                const settingsTab = document.querySelector('[value="settings"]') as HTMLElement
                if (settingsTab) {
                  settingsTab.click()
                }
              }}
              className="hover:bg-primary/20 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <DashboardStats debouncedFetch={debouncedFetch} />

          {/* Quick Navigation Menu */}
          <div className="mt-4 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { key: 'projects', label: 'Projects', Icon: FolderOpen },
              { key: 'requests', label: 'Requests', Icon: MessageSquare },
              { key: 'settings', label: 'Settings', Icon: Settings },
              { key: 'themes', label: 'Themes', Icon: Palette },
              { key: 'blog', label: 'Blog', Icon: FileText },
              { key: 'docs', label: 'Docs', Icon: BookOpen },
            ].map(({ key, label, Icon }) => (
              <Button
                key={key}
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  const tab = document.querySelector(`[value="${key}"]`) as HTMLElement | null
                  tab?.click()
                }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="glassmorphism bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg">
              <TabsTrigger value="projects" className="data-[state=active]:bg-primary/20">
                <FolderOpen className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-primary/20">
                <MessageSquare className="h-4 w-4 mr-2" />
                Client Requests
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">
                <Settings className="h-4 w-4 mr-2" />
                Website Settings
              </TabsTrigger>
              <TabsTrigger value="themes" className="data-[state=active]:bg-primary/20">
                <Palette className="h-4 w-4 mr-2" />
                Theme Management
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-primary/20">
                <FileText className="h-4 w-4 mr-2" />
                Blog Management
              </TabsTrigger>
              <TabsTrigger value="docs" className="data-[state=active]:bg-primary/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <ProjectsTab debouncedFetch={debouncedFetch} />
            </TabsContent>

            <TabsContent value="requests">
              <ClientRequestsTab debouncedFetch={debouncedFetch} />
            </TabsContent>

            <TabsContent value="settings">
              <WebsiteSettingsTab debouncedFetch={debouncedFetch} />
            </TabsContent>

            <TabsContent value="themes">
              <ThemeManagementTab debouncedFetch={debouncedFetch} />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManagementTab debouncedFetch={debouncedFetch} />
            </TabsContent>

            <TabsContent value="docs">
              <DocumentationTab debouncedFetch={debouncedFetch} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

function ThemeManagementTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [themes, setThemes] = useState<any[]>([])
  const [activeTheme, setActiveTheme] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<any>(null)
  const [themeHistory, setThemeHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingTheme, setEditingTheme] = useState<any>(null)

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setThemes(data.themes)
          setActiveTheme(data.activeTheme)
        }
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const activateTheme = async (themeId: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/themes/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setActiveTheme(data.activeTheme)
          // Apply CSS to the page
          applyThemeCSS(data.css)
          // Dispatch theme update event to main page
          window.dispatchEvent(new CustomEvent('themeUpdated', { detail: data.activeTheme }))
          alert('Theme activated successfully!')
        }
      } else {
        alert('Failed to activate theme')
      }
    } catch (error) {
      console.error('Error activating theme:', error)
      alert('Error activating theme')
    } finally {
      setIsSaving(false)
    }
  }

  const applyThemeCSS = (css: string) => {
    // Remove existing theme styles
    const existingStyle = document.getElementById('dynamic-theme')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Add new theme styles
    const style = document.createElement('style')
    style.id = 'dynamic-theme'
    style.textContent = css
    document.head.appendChild(style)
  }

  const deleteTheme = async (themeId: string) => {
    if (!confirm('Are you sure you want to delete this theme?')) return

    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchThemes()
        alert('Theme deleted successfully!')
      } else {
        alert('Failed to delete theme')
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
      alert('Error deleting theme')
    }
  }

  const fetchThemeHistory = async (themeId: string) => {
    try {
      const response = await fetch(`/api/themes/history?themeId=${themeId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setThemeHistory(data.history)
          setShowHistory(true)
        }
      }
    } catch (error) {
      console.error('Error fetching theme history:', error)
    }
  }

  const revertTheme = async (themeId: string, historyId: string) => {
    try {
      const response = await fetch('/api/themes/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId, historyId }),
      })

      if (response.ok) {
        await fetchThemes()
        setShowHistory(false)
        alert('Theme reverted successfully!')
      } else {
        alert('Failed to revert theme')
      }
    } catch (error) {
      console.error('Error reverting theme:', error)
      alert('Error reverting theme')
    }
  }

  const duplicateTheme = async (themeId: string) => {
    const newName = prompt('Enter name for the duplicated theme:')
    if (!newName) return

    try {
      const response = await fetch('/api/themes/duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId, newName }),
      })

      if (response.ok) {
        await fetchThemes()
        alert('Theme duplicated successfully!')
      } else {
        alert('Failed to duplicate theme')
      }
    } catch (error) {
      console.error('Error duplicating theme:', error)
      alert('Error duplicating theme')
    }
  }

  const openThemeEditor = (theme: any) => {
    setEditingTheme(theme)
    setShowEditor(true)
  }

  const saveThemeChanges = async (updatedTheme: any) => {
    try {
      const response = await fetch(`/api/themes/${updatedTheme._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTheme),
      })

      if (response.ok) {
        await fetchThemes()
        setShowEditor(false)
        setEditingTheme(null)
        alert('Theme updated successfully!')
      } else {
        alert('Failed to update theme')
      }
    } catch (error) {
      console.error('Error updating theme:', error)
      alert('Error updating theme')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading themes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Theme Management</h2>
        <Button 
          onClick={() => {
            // TODO: Open theme creation dialog
            alert('Theme creation coming soon!')
          }}
          className="glow hover:glow-amber transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Theme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card 
            key={theme._id} 
            className={`glassmorphism bg-slate-800/40 backdrop-blur-md border shadow-lg p-6 transition-all duration-300 ${
              theme.isActive 
                ? 'ring-2 ring-primary border-primary/50 bg-primary/5 shadow-primary/20' 
                : 'border-slate-700/50 hover:border-slate-600/50 hover:shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{theme.name}</h3>
                {theme.isActive && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary">ACTIVE</span>
                  </div>
                )}
              </div>

              {/* Theme Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Color Palette</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div 
                      className="w-full h-6 rounded border"
                      style={{ backgroundColor: theme.colors?.primary || '#3b82f6' }}
                      title={`Primary: ${theme.colors?.primary || '#3b82f6'}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">Primary</span>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className="w-full h-6 rounded border"
                      style={{ backgroundColor: theme.colors?.secondary || '#64748b' }}
                      title={`Secondary: ${theme.colors?.secondary || '#64748b'}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">Secondary</span>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className="w-full h-6 rounded border"
                      style={{ backgroundColor: theme.colors?.accent || '#f59e0b' }}
                      title={`Accent: ${theme.colors?.accent || '#f59e0b'}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">Accent</span>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className="w-full h-6 rounded border"
                      style={{ backgroundColor: theme.colors?.background || '#0f172a' }}
                      title={`Background: ${theme.colors?.background || '#0f172a'}`}
                    ></div>
                    <span className="text-xs text-muted-foreground">Background</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Typography</h4>
                  <p className="text-sm" style={{ fontFamily: theme.typography?.fontFamily || 'Inter, sans-serif' }}>
                    {theme.typography?.fontFamily || 'Inter, sans-serif'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Base size: {theme.typography?.fontSize?.base || '16px'}
                  </p>
                </div>

                {/* Visual Effects */}
                {theme.effects && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Visual Effects</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(theme.effects).map(([effect, enabled]) => (
                        <Badge 
                          key={effect} 
                          variant={enabled ? "default" : "outline"}
                          className="text-xs"
                        >
                          {effect.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Actions */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  {!theme.isActive && (
                    <Button
                      onClick={() => activateTheme(theme._id)}
                      disabled={isSaving}
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openThemeEditor(theme)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateTheme(theme._id)}
                    title="Duplicate theme"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchThemeHistory(theme._id)}
                    title="View history"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTheme(theme._id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete theme"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Theme Info */}
                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">{theme.version || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="font-medium">{new Date(theme.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {theme.customCSS && (
                    <div className="flex justify-between">
                      <span>Custom CSS:</span>
                      <span className="font-medium">{theme.customCSS?.length || 0} chars</span>
                    </div>
                  )}
                  {theme.effects && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Active Effects:</div>
                      <div className="flex flex-wrap gap-1">
                        {theme.effects?.backgroundParticles && <span className="px-1 py-0.5 bg-primary/20 text-primary rounded text-xs">Particles</span>}
                        {theme.effects?.glowEffects && <span className="px-1 py-0.5 bg-secondary/20 text-secondary rounded text-xs">Glow</span>}
                        {theme.effects?.glassmorphism && <span className="px-1 py-0.5 bg-accent/20 text-accent rounded text-xs">Glass</span>}
                        {theme.effects?.neonBorders && <span className="px-1 py-0.5 bg-warning/20 text-warning rounded text-xs">Neon</span>}
                        {theme.effects?.gradientBackgrounds && <span className="px-1 py-0.5 bg-success/20 text-success rounded text-xs">Gradient</span>}
                        {theme.effects?.animatedElements && <span className="px-1 py-0.5 bg-destructive/20 text-destructive rounded text-xs">Animated</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No themes found</h3>
          <p className="text-muted-foreground">Create your first theme to get started.</p>
        </div>
      )}

      {/* Theme History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Theme History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {themeHistory.map((history) => (
                <div
                  key={history._id}
                  className="border border-border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Version {history.version}</h4>
                      <p className="text-sm text-muted-foreground">
                        {history.changeDescription}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(history.createdAt).toLocaleString()}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => revertTheme(history.themeId, history._id)}
                        className="mt-2"
                      >
                        Revert
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Theme Editor Modal */}
      {showEditor && editingTheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Theme: {editingTheme.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditor(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ThemeEditor
              theme={editingTheme}
              onSave={saveThemeChanges}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Theme Editor Component
function ThemeEditor({ theme, onSave, onCancel }: { theme: any, onSave: (theme: any) => void, onCancel: () => void }) {
  const [editedTheme, setEditedTheme] = useState({
    ...theme,
    colors: theme.colors || {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#0f172a',
      foreground: '#f8fafc',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8'
    },
    typography: theme.typography || {
      fontFamily: 'Inter, sans-serif',
      fontSize: { base: '16px' }
    },
    effects: theme.effects || {
      backgroundParticles: false,
      glowEffects: false,
      glassmorphism: false,
      neonBorders: false,
      gradientBackgrounds: false,
      animatedElements: false
    }
  })

  const handleSave = () => {
    onSave(editedTheme)
  }

  const updateColor = (colorType: string, value: string) => {
    setEditedTheme({
      ...editedTheme,
      colors: {
        ...editedTheme.colors,
        [colorType]: value
      }
    })
  }

  const updateEffect = (effectType: string, value: boolean) => {
    setEditedTheme({
      ...editedTheme,
      effects: {
        ...editedTheme.effects,
        [effectType]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="themeName">Theme Name</Label>
            <Input
              id="themeName"
              value={editedTheme.name}
              onChange={(e) => setEditedTheme({ ...editedTheme, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input
              id="fontFamily"
              value={editedTheme.typography?.fontFamily || ''}
              onChange={(e) => setEditedTheme({
                ...editedTheme,
                typography: { 
                  ...editedTheme.typography, 
                  fontFamily: e.target.value,
                  fontSize: editedTheme.typography?.fontSize || { base: '16px' }
                }
              })}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Colors</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(editedTheme.colors || {}).filter(([key]) => !key.startsWith('text')).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">{key}</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={value as string}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="w-8 h-8 rounded border border-border"
                />
                <Input
                  id={key}
                  value={value as string}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Text Colors */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Text Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(editedTheme.colors || {}).filter(([key]) => key.startsWith('text')).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {key.replace('text', '').toLowerCase() || 'Primary'} Text
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={value as string}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="w-8 h-8 rounded border border-border"
                />
                <Input
                  id={key}
                  value={value as string}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {key === 'textPrimary' && 'Main text color for paragraphs and body text'}
                {key === 'textSecondary' && 'Secondary text color for subtitles and descriptions'}
                {key === 'textMuted' && 'Muted text color for less important information'}
                {key === 'textAccent' && 'Accent text color for highlights and emphasis'}
                {key === 'textInverse' && 'Inverse text color for dark backgrounds'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Visual Effects</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editedTheme.effects && Object.entries(editedTheme.effects || {}).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={key}
                checked={value as boolean}
                onChange={(e) => updateEffect(key, e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor={key} className="capitalize text-sm">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Custom CSS</h4>
        <Textarea
          value={editedTheme.customCSS || ''}
          onChange={(e) => setEditedTheme({ ...editedTheme, customCSS: e.target.value })}
          placeholder="Enter custom CSS here..."
          rows={6}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

// Error Boundary Component
class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Admin Panel Error</h2>
              <p className="text-muted-foreground mb-4">
                Something went wrong with the admin panel. Please refresh the page.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token')
      const tokenExpiry = localStorage.getItem('admin_token_expiry')
      
      if (token && tokenExpiry) {
        const now = new Date().getTime()
        const expiry = parseInt(tokenExpiry)
        
        if (now < expiry) {
          setIsAuthenticated(true)
        } else {
          // Token expired, clear it
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_token_expiry')
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()

    // Set up periodic session check to extend session on activity
    const sessionCheckInterval = setInterval(() => {
      if (isAuthenticated) {
        const token = localStorage.getItem('admin_token')
        const tokenExpiry = localStorage.getItem('admin_token_expiry')
        
        if (token && tokenExpiry) {
          const now = new Date().getTime()
          const expiry = parseInt(tokenExpiry)
          
          // If token expires in less than 1 hour, extend it
          if (expiry - now < 60 * 60 * 1000) {
            const newExpiry = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
            localStorage.setItem('admin_token_expiry', newExpiry.toString())
          }
        }
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    // Listen for visibility changes to extend session when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        const token = localStorage.getItem('admin_token')
        if (token) {
          const newExpiry = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
          localStorage.setItem('admin_token_expiry', newExpiry.toString())
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(sessionCheckInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    // Set token with 24 hour expiry
    const token = 'admin_session_' + Date.now()
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
    
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_token_expiry', expiry.toString())
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_token_expiry')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AdminErrorBoundary>
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <AdminDashboard key="dashboard" onLogout={handleLogout} />
        ) : (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </AdminErrorBoundary>
  )
}

// Client Request Form Component
function ClientRequestForm({ request, onSave }: { request: ClientRequest, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: request.name || '',
    email: request.email || '',
    phone: request.phone || '',
    projectType: request.projectType || '',
    budget: request.budget || '',
    timeline: request.timeline || '',
    requirements: request.requirements || '',
    referenceLinks: request.referenceLinks?.join('\n') || '',
    status: request.status || 'pending',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const requestData = {
      ...formData,
      referenceLinks: formData.referenceLinks.split('\n').filter(link => link.trim()),
    }
    onSave(requestData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="projectType">Project Type</Label>
          <Input
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="referenceLinks">Reference Links (one per line)</Label>
        <Textarea
          id="referenceLinks"
          value={formData.referenceLinks}
          onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
          rows={3}
          placeholder="https://example.com&#10;https://another-example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border border-border rounded-md bg-background"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

// Blog Management Tab Component
function BlogManagementTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [blogs, setBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      if (data.success) {
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBlog = async (blogData: any) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      })
      
      if (response.ok) {
        await fetchBlogs()
        setShowCreateForm(false)
        alert('Blog post created successfully!')
      } else {
        alert('Failed to create blog post')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog post')
    }
  }

  const handleUpdateBlog = async (id: string, blogData: any) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      })
      
      if (response.ok) {
        await fetchBlogs()
        setEditingBlog(null)
        alert('Blog post updated successfully!')
      } else {
        alert('Failed to update blog post')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      alert('Failed to update blog post')
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchBlogs()
        alert('Blog post deleted successfully!')
      } else {
        alert('Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog post')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Blog Post
        </Button>
      </div>

      {showCreateForm && (
        <BlogForm
          onSave={handleCreateBlog}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingBlog && (
        <BlogForm
          blog={editingBlog}
          onSave={(data) => handleUpdateBlog(editingBlog._id, data)}
          onCancel={() => setEditingBlog(null)}
        />
      )}

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No blog posts found. Create your first blog post!
          </div>
        ) : (
          blogs.map((blog) => (
            <Card key={blog._id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Status: {blog.status}</span>
                    <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>Views: {blog.views || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingBlog(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Documentation Tab Component
function DocumentationTab({ debouncedFetch }: { debouncedFetch: (url: string, delay?: number) => Promise<any> }) {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'projects', title: 'Project Management', icon: FolderOpen },
    { id: 'clients', title: 'Client Management', icon: MessageSquare },
    { id: 'settings', title: 'Website Settings', icon: Settings },
    { id: 'themes', title: 'Theme Management', icon: Palette },
    { id: 'blog', title: 'Blog Management', icon: FileText },
    { id: 'api', title: 'API Reference', icon: Code },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: HelpCircle }
  ]

  const documentation = {
    overview: {
      title: "Admin Panel Overview",
      content: `# Admin Panel Documentation

Welcome to your portfolio admin panel! This comprehensive dashboard allows you to manage all aspects of your portfolio website.

## Quick Start
1. **Projects**: Manage your portfolio projects
2. **Client Requests**: Handle incoming client inquiries
3. **Website Settings**: Update your personal information and site content
4. **Theme Management**: Customize the visual appearance
5. **Blog Management**: Create and manage blog posts
6. **Documentation**: This help section

## Key Features
- ✅ Real-time updates
- ✅ MongoDB database integration
- ✅ Responsive design
- ✅ Theme customization
- ✅ File upload support
- ✅ SEO optimization`
    },
    projects: {
      title: "Project Management",
      content: `# Project Management Guide

## Creating a Project
1. Click "Create Project" button
2. Fill in project details:
   - **Title**: Project name
   - **Description**: Detailed project description
   - **Technologies**: Tech stack used
   - **Image URL**: Project screenshot
   - **Live URL**: Live project link
   - **GitHub URL**: Source code link
   - **Category**: Project type
   - **Featured**: Mark as featured project
   - **Active**: Show on website

## Editing Projects
- Click the edit icon next to any project
- Modify the details and save
- Changes appear immediately on the website

## Deleting Projects
- Click the delete icon (trash can)
- Confirm deletion
- Project is permanently removed

## Best Practices
- Use high-quality images (1200x800px recommended)
- Write compelling descriptions
- Include relevant technologies
- Keep projects updated`
    },
    clients: {
      title: "Client Management",
      content: `# Client Request Management

## Managing Client Requests
1. **View Requests**: All incoming requests appear in the table
2. **Status Updates**: 
   - Pending: New request
   - Reviewed: You've looked at it
   - Approved: Moving forward
   - Rejected: Not proceeding

## Request Details
- **Contact Info**: Name, email, phone
- **Project Details**: Type, budget, timeline
- **Requirements**: Specific needs
- **Reference Links**: Examples or inspiration

## Actions Available
- **Mark as Reviewed**: Acknowledge the request
- **Approve**: Accept the project
- **Reject**: Decline the project
- **Edit**: Modify request details
- **Delete**: Remove the request

## Response Management
- Use the built-in response system
- Track communication history
- Set follow-up reminders`
    },
    settings: {
      title: "Website Settings",
      content: `# Website Settings Guide

## Personal Information
- **Name**: Your full name
- **Title**: Professional title
- **Subtitle**: Brief description
- **Description**: About yourself
- **Contact Info**: Email, phone, location

## Profile Management
- **Profile Image**: Upload your photo
- **Resume**: Link to your CV
- **Social Links**: GitHub, LinkedIn, etc.

## Content Management
- **Hero Section**: Main landing content
- **About Section**: Personal story
- **Skills**: Technical abilities
- **Experience**: Work history
- **Education**: Academic background

## SEO Settings
- **Meta Title**: Page title
- **Meta Description**: Search description
- **Keywords**: SEO keywords
- **Favicon**: Site icon

## Best Practices
- Keep information current
- Use professional photos
- Write compelling descriptions
- Include relevant keywords`
    },
    themes: {
      title: "Theme Management",
      content: `# Theme Management Guide

## Available Themes
- **Futuristic Matrix**: Neon green/black theme
- **Dark Professional**: Clean dark theme
- **Cyberpunk Neon**: Bright cyberpunk colors
- **Minimalist**: Clean and simple
- **Ocean Blue**: Blue color scheme
- **Sunset Orange**: Warm orange tones

## Customizing Themes
1. **Colors**: Primary, secondary, accent colors
2. **Typography**: Fonts and text styles
3. **Layout**: Spacing and borders
4. **Components**: Button and card styles
5. **Effects**: Background particles, animations
6. **Custom CSS**: Advanced styling

## Theme Features
- **Live Preview**: See changes instantly
- **Version History**: Track all changes
- **Revert**: Go back to previous versions
- **Duplicate**: Create theme variations
- **Export/Import**: Share themes

## Advanced Customization
- **CSS Variables**: Direct CSS editing
- **Animation Settings**: Motion preferences
- **Responsive Design**: Mobile optimization
- **Accessibility**: Color contrast compliance`
    },
    blog: {
      title: "Blog Management",
      content: `# Blog Management Guide

## Creating Blog Posts
1. Click "Create Blog Post"
2. Fill in the form:
   - **Title**: Post headline
   - **Slug**: URL-friendly version
   - **Excerpt**: Short description
   - **Content**: Full blog content (Markdown)
   - **Featured Image**: Post thumbnail
   - **Tags**: Categorization
   - **Status**: Draft/Published
   - **SEO**: Meta information

## Content Editor
- **Markdown Support**: Rich text formatting
- **Code Highlighting**: Syntax highlighting
- **Image Upload**: Drag and drop images
- **Preview**: Live content preview
- **Word Count**: Content length tracking

## Publishing Workflow
1. **Draft**: Work in progress
2. **Review**: Check content
3. **Publish**: Make live
4. **Schedule**: Future publishing
5. **Update**: Edit published posts

## SEO Optimization
- **Meta Title**: Search result title
- **Meta Description**: Search snippet
- **Keywords**: Target keywords
- **URL Structure**: Clean URLs
- **Image Alt Text**: Accessibility

## Analytics
- **View Count**: Post popularity
- **Engagement**: Reader interaction
- **Performance**: Load times
- **Search Ranking**: SEO metrics`
    },
    api: {
      title: "API Reference",
      content: `# API Reference

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
All admin endpoints require authentication:
\`\`\`
Headers: {
  "Authorization": "Bearer <token>"
}
\`\`\`

## Endpoints

### Projects
- \`GET /api/projects\` - List all projects
- \`POST /api/projects\` - Create project
- \`GET /api/projects/:id\` - Get project
- \`PUT /api/projects/:id\` - Update project
- \`DELETE /api/projects/:id\` - Delete project

### Client Requests
- \`GET /api/client-requests\` - List requests
- \`POST /api/client-requests\` - Create request
- \`PUT /api/client-requests/:id\` - Update request
- \`PATCH /api/client-requests/:id\` - Update status

### Website Settings
- \`GET /api/settings\` - Get settings
- \`PUT /api/settings\` - Update settings

### Themes
- \`GET /api/themes\` - List themes
- \`POST /api/themes\` - Create theme
- \`PUT /api/themes/:id\` - Update theme
- \`DELETE /api/themes/:id\` - Delete theme
- \`POST /api/themes/activate\` - Activate theme

### Blogs
- \`GET /api/blogs\` - List blogs
- \`POST /api/blogs\` - Create blog
- \`PUT /api/blogs/:id\` - Update blog
- \`DELETE /api/blogs/:id\` - Delete blog

## Response Format
\`\`\`json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
\`\`\``
    },
    troubleshooting: {
      title: "Troubleshooting",
      content: `# Troubleshooting Guide

## Common Issues

### 404 Errors
- **Problem**: API endpoints returning 404
- **Solution**: Check if server is running and endpoints exist
- **Prevention**: Use proper API routes and error handling

### Database Connection Issues
- **Problem**: MongoDB connection failed
- **Solution**: Check MONGODB_URI in .env.local
- **Fallback**: System uses memory storage as backup

### Theme Not Applying
- **Problem**: Theme changes not visible
- **Solution**: Clear browser cache, check CSS variables
- **Debug**: Check browser console for errors

### File Upload Issues
- **Problem**: Images not uploading
- **Solution**: Check file size limits and formats
- **Supported**: JPG, PNG, GIF, WebP

### Performance Issues
- **Problem**: Slow loading times
- **Solution**: Optimize images, check database queries
- **Monitoring**: Use browser dev tools

## Debug Mode
Enable debug logging:
\`\`\`javascript
localStorage.setItem('debug', 'true')
\`\`\`

## Getting Help
1. Check browser console for errors
2. Review server logs
3. Test API endpoints directly
4. Check database connectivity
5. Verify environment variables

## Best Practices
- Regular backups
- Test changes in development
- Monitor performance
- Keep dependencies updated
- Document customizations`
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Documentation</h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                </button>
              )
            })}
          </nav>
        </Card>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {documentation[activeSection as keyof typeof documentation]?.title}
          </h2>
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap text-sm">
              {documentation[activeSection as keyof typeof documentation]?.content}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Blog Form Component
function BlogForm({ blog, onSave, onCancel }: { blog?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    featuredImage: blog?.featuredImage || '',
    tags: blog?.tags?.join(', ') || '',
    status: blog?.status || 'draft',
    metaTitle: blog?.metaTitle || '',
    metaDescription: blog?.metaDescription || '',
    keywords: blog?.keywords || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date()
    }
    onSave(data)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {blog ? 'Edit Blog Post' : 'Create Blog Post'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            className="font-mono"
          />
        </div>

        <div>
          <Label htmlFor="featuredImage">Featured Image URL</Label>
          <Input
            id="featuredImage"
            value={formData.featuredImage}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react, javascript, web development"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {blog ? 'Update' : 'Create'} Blog Post
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
