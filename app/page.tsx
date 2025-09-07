"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, Float } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ClientRequestForm } from "@/components/client-request-form"
import Chatbot from "@/components/chatbot"
import {
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Code,
  Shield,
  Zap,
  ExternalLink,
  Eye,
  Globe,
  Music,
  Play,
  Pause,
  Volume2,
  Heart,
  Coffee,
  Camera,
  Headphones,
  Send,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react"

// 3D Scene Component - Temporarily disabled for debugging
/* function Scene() {
  const meshRef = useRef<any>()

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#dc2626" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f59e0b" />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.3, 16, 100]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[3, 2, -2]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={3}>
        <mesh position={[-3, -1, -1]}>
          <icosahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
} */

// Animated Tagline Component
function AnimatedTagline({ websiteSettings }: { websiteSettings?: any }) {
  const skills = websiteSettings?.profile?.title?.split(' & ') || [
    "Cybersecurity Expert",
    "Bug Hunter", 
    "Customer Success Manager",
    "Security Researcher",
    "Penetration Tester",
  ]

  const [currentSkill, setCurrentSkill] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [skills.length])

  return (
    <motion.div
      key={currentSkill}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-2xl md:text-4xl font-serif font-bold text-glow text-primary"
    >
      {skills[currentSkill]}
    </motion.div>
  )
}

// Particle Background Component
function ParticleBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  if (dimensions.width === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Cinematic Water Drop Component
function WaterDropEffect() {
  const [scrollY, setScrollY] = useState(0)
  const [dropVisible, setDropVisible] = useState(false)
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Show drop when scrolling starts
    if (scrollY > 100 && !dropVisible) {
      setDropVisible(true)
      // Position drop on the right side, starting from top
      setDropPosition({
        x: window.innerWidth * 0.75, // 75% from left
        y: -100
      })
    }
  }, [scrollY, dropVisible])

  if (!dropVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {/* Leaf Branch */}
      <div 
        className="absolute"
        style={{
          left: `${dropPosition.x - 20}px`,
          top: '50px',
          zIndex: 1,
        }}
      >
        {/* Branch */}
        <div 
          className="w-1 h-16 bg-gradient-to-b from-green-800 to-green-600 rounded-full"
          style={{
            transform: 'rotate(-15deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        
        {/* Leaf */}
        <div 
          className="absolute top-12 left-0 w-8 h-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
            transform: 'rotate(-15deg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />
        
        {/* Leaf Veins */}
        <div 
          className="absolute top-12 left-0 w-8 h-4"
          style={{
            background: `
              linear-gradient(90deg, transparent 30%, rgba(34,197,94,0.3) 50%, transparent 70%),
              linear-gradient(0deg, transparent 20%, rgba(34,197,94,0.2) 50%, transparent 80%)
            `,
            transform: 'rotate(-15deg)',
          }}
        />
      </div>

      {/* Single Water Drop */}
      <motion.div
        className="absolute"
        initial={{
          x: dropPosition.x,
          y: dropPosition.y,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          y: window.innerHeight + 200,
          opacity: [0, 1, 1, 0.8, 0],
          scale: [0.5, 1, 1.1, 1, 0.8],
          x: dropPosition.x + (scrollY * 0.1), // Slight drift as it falls
        }}
        transition={{
          duration: 8,
          ease: "easeIn",
          times: [0, 0.1, 0.3, 0.7, 1],
        }}
        style={{
          width: 12,
          height: 12,
        }}
      >
        {/* Drop Shadow */}
        <div 
          className="absolute inset-0 rounded-full blur-sm"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
            transform: 'translateY(2px)',
          }}
        />
        
        {/* Main Water Drop */}
        <div className="relative w-full h-full">
          {/* Outer Glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />
          
          {/* Glassmorphic Water Drop */}
          <div 
            className="absolute inset-0 rounded-full backdrop-blur-sm border border-white/40 shadow-lg"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 0%, transparent 60%),
                linear-gradient(135deg, 
                  rgba(6,182,212,0.7) 0%, 
                  rgba(59,130,246,0.8) 30%,
                  rgba(147,51,234,0.6) 60%,
                  rgba(6,182,212,0.7) 100%
                )
              `,
              boxShadow: `
                0 0 15px rgba(6,182,212,0.5),
                0 0 30px rgba(59,130,246,0.3),
                inset 0 1px 0 rgba(255,255,255,0.6),
                inset 0 -1px 0 rgba(0,0,0,0.2)
              `,
            }}
          />
          
          {/* Inner Highlight */}
          <div 
            className="absolute top-0.5 left-1 w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)',
            }}
          />
          
          {/* Refraction Effect */}
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full opacity-50"
            style={{
              background: `
                conic-gradient(from 0deg at 50% 50%, 
                  transparent 0deg, 
                  rgba(255,255,255,0.3) 45deg, 
                  transparent 90deg,
                  transparent 180deg,
                  rgba(6,182,212,0.2) 225deg,
                  transparent 270deg,
                  transparent 360deg
                )
              `,
              animation: 'spin 4s linear infinite',
            }}
          />
          
          {/* Holographic Shimmer */}
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full opacity-30"
            style={{
              background: `
                linear-gradient(45deg, 
                  transparent 40%, 
                  rgba(255,255,255,0.2) 50%, 
                  transparent 60%
                )
              `,
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
        </div>
        
        {/* Water Trail */}
        <motion.div
          className="absolute top-full left-1/2 w-0.5 h-6 rounded-full"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0.6, 0.3, 0],
            scaleY: [0, 1, 1.2, 1, 0],
            y: [0, 10, 20, 30, 40]
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            background: 'linear-gradient(to bottom, rgba(6,182,212,0.8), transparent)',
            transform: 'translateX(-50%)',
          }}
        />
      </motion.div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
      `}</style>
    </div>
  )
}

// Skills Visualization Component
function SkillsVisualization() {
  const skillsData = [
    { name: "Cybersecurity & Penetration Testing", level: 85 },
    { name: "Bug Hunting & Vulnerability Assessment", level: 80 },
    { name: "Customer Success Management", level: 85 },
    { name: "Network Security & SIEM/SOAR", level: 75 },
    { name: "Python & Bash Scripting", level: 80 },
    { name: "Cloud Security (AWS/Azure)", level: 70 },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skillsData.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="glassmorphism bg-card/10 p-6 rounded-lg border border-border/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className={`h-6 w-6 text-primary`} />
            <h3 className="font-serif font-semibold text-lg text-primary">{skill.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Proficiency</span>
              <span className="font-medium text-primary">{skill.level}%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            >
              <Progress value={skill.level} className="h-2" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Timeline Component
function Timeline() {
  const timelineData = [
    {
      year: "2024",
      title: "Customer Success Manager",
      company: "CyberCare (NordVPN)",
      description: "Working on customer success initiatives and providing security consulting for clients.",
    },
    {
      year: "2020",
      title: "Security Researcher & Bug Hunter",
      company: "Bugcrowd",
      description: "Participated in bug bounty programs and gained experience in vulnerability research.",
    },
    {
      year: "2021",
      title: "TryHackMe Platform",
      company: "TryHackMe Platform",
      description: "Completed various cybersecurity challenges and learning modules.",
    },
    {
      year: "2018",
      title: "Bachelor's in Science",
      company: "Siddhi Vinayak Group",
      description: "Completed foundational studies in computer science and information systems.",
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="relative">
      {/* Timeline Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary transform md:-translate-x-1/2" />

      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform md:-translate-x-1/2 z-10 ${
                true ? "bg-primary glow" : "bg-secondary"
              }`}
            />

            {/* Content Card */}
            <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
              <Card className="glassmorphism bg-card/10 border-border/30 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-serif font-bold text-primary">{item.year}</span>
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-primary">{item.title}</h3>
                <p className="leading-relaxed text-secondary">{item.description}</p>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}

// Project Card Component with 3D Hover Effects
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 10 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group perspective-1000"
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="transform-gpu"
      >
        <Card className="glassmorphism bg-card/10 border-border/30 overflow-hidden h-full hover:glow-amber transition-all duration-300">
          {/* Project Image/Icon */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Code className="h-16 w-16 text-primary" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="glassmorphism">
                {project.tags[0]}
              </Badge>
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6">
            <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.slice(0, 3).map((tech: string) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 3} more
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif flex items-center gap-3">
                      <Code className="h-8 w-8 text-primary" />
                      {project.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Project Image */}
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <Code className="h-24 w-24 text-primary" />
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-serif font-semibold mb-2">About This Project</h4>
                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className="font-serif font-semibold mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tech: string) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-serif font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {project.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <Zap className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          Source Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Projects Portfolio Component
function ProjectsPortfolio() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback projects data
  const fallbackProjects = [
    {
      id: 1,
      title: "Vulnerability Assessment Platform",
      description:
        "Automated vulnerability scanning and assessment tool designed for comprehensive security analysis. Features real-time threat detection, detailed reporting, and integration with popular security frameworks.",
      image: "/cybersecurity-vulnerability-assessment-dashboard-w.jpg",
      tags: ["Python", "Django", "PostgreSQL", "Security", "Automation"],
      github: "https://github.com/0xDracarys/vulnerability-platform",
      demo: "https://vuln-platform-demo.netlify.app",
      features: [
        "Automated vulnerability scanning",
        "Real-time threat detection",
        "Comprehensive security reports",
        "Integration with security frameworks",
        "Custom rule engine",
      ],
    },
    {
      id: 2,
      title: "Bugcrowd Analytics Dashboard",
      description:
        "Advanced analytics platform for bug bounty programs with data visualization, performance tracking, and automated reporting. Helps researchers and companies optimize their security programs.",
      image: "/bug-bounty-analytics-dashboard-with-charts-and-gra.jpg",
      tags: ["React", "Node.js", "MongoDB", "Analytics", "D3.js"],
      github: "https://github.com/0xDracarys/bugcrowd-analytics",
      demo: "https://bugcrowd-analytics-demo.netlify.app",
      features: [
        "Real-time analytics dashboard",
        "Performance tracking metrics",
        "Automated report generation",
        "Data visualization tools",
        "API integration with Bugcrowd",
      ],
    },
    {
      id: 3,
      title: "Customer Support Automation",
      description:
        "AI-powered customer support system leveraging machine learning for intelligent ticket routing, automated responses, and sentiment analysis. Built for CyberCare operations.",
      image: "/ai-customer-support-dashboard.png",
      tags: ["Next.js", "Python", "OpenAI", "AI/ML", "Customer Success"],
      github: "https://github.com/0xDracarys/support-automation",
      demo: "https://support-ai-demo.netlify.app",
      features: [
        "AI-powered ticket routing",
        "Automated response generation",
        "Sentiment analysis",
        "Multi-language support",
        "Performance analytics",
      ],
    },
    {
      id: 4,
      title: "Security Research Lab",
      description:
        "Interactive platform for cybersecurity research and training. Features virtual labs, exploit development environments, and collaborative research tools for security professionals.",
      image: "/cybersecurity-research-lab-interface-with-terminal.jpg",
      tags: ["React", "Docker", "Kubernetes", "Security", "DevOps"],
      github: "https://github.com/0xDracarys/security-lab",
      demo: "https://security-lab-demo.netlify.app",
      features: [
        "Virtual security labs",
        "Exploit development environment",
        "Collaborative research tools",
        "Containerized environments",
        "Real-time collaboration",
      ],
    },
    {
      id: 5,
      title: "TryHackMe Leaderboard Tracker",
      description:
        "Personal tracking system for TryHackMe progress with advanced analytics, goal setting, and performance visualization. Helped achieve Top 5 Lithuania ranking.",
      image: "/tryhackme-progress-tracker-with-leaderboard-and-st.jpg",
      tags: ["Python", "Selenium", "FastAPI", "Data Analysis", "Automation"],
      github: "https://github.com/0xDracarys/tryhackme-tracker",
      demo: "https://tryhackme.com/p/ShubhamBhasker",
      features: [
        "Progress tracking automation",
        "Leaderboard monitoring",
        "Performance analytics",
        "Goal setting and reminders",
        "Achievement visualization",
      ],
    },
    {
      id: 6,
      title: "Custom Linux Security Build",
      description:
        "Custom Linux distribution optimized for security and penetration testing. Features pre-configured security tools, hardened kernel, and specialized environments for security research.",
      image: "/custom-linux-desktop-with-security-tools-and-termi.jpg",
      tags: ["Linux", "C", "Bash", "Security", "System Administration"],
      github: "https://github.com/0xDracarys/secure-linux",
      demo: "https://secure-linux-demo.netlify.app",
      features: [
        "Hardened Linux kernel",
        "Pre-configured security tools",
        "Penetration testing environment",
        "Custom security scripts",
        "Optimized for research",
      ],
    },
  ]

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?active=true')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.projects) {
            // Transform API data to match expected format
            const transformedProjects = data.projects.map((project: any) => ({
              id: project._id || project.id,
              title: project.title,
              description: project.description,
              image: project.image,
              tags: project.tags || [],
              github: project.github,
              demo: project.demo,
              features: project.features || [],
            }))
            setProjects(transformedProjects)
          } else {
            setProjects(fallbackProjects)
          }
        } else {
          setProjects(fallbackProjects)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects(fallbackProjects)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Featured <span className="text-primary text-glow">Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Here are some of my recent projects in cybersecurity, web development, and digital solutions. Each project
            represents a learning experience and practical application of various technologies.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading projects...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="glassmorphism hover:glow-amber transition-all duration-300 bg-transparent"
          >
            <Github className="h-5 w-5 mr-2" />
            View All Projects on GitHub
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Personal Showcase Component
function PersonalShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const guitarTracks = [
    {
      title: "Neon Dreams",
      description: "An ambient guitar piece inspired by cyberpunk aesthetics",
      duration: "3:42",
      genre: "Ambient Rock",
    },
    {
      title: "Digital Echoes",
      description: "Electronic guitar fusion with synthesized elements",
      duration: "4:15",
      genre: "Electronic Rock",
    },
    {
      title: "Code & Strings",
      description: "A melodic journey through the intersection of music and technology",
      duration: "5:23",
      genre: "Progressive",
    },
  ]

  const personalInterests = [
    {
      icon: Shield,
      title: "Table Tennis",
      description: "I enjoy playing table tennis for the strategic thinking and quick reflexes it requires.",
      color: "text-primary",
    },
    {
      icon: Code,
      title: "Chess",
      description: "I like playing chess for the mental challenge and tactical thinking involved.",
      color: "text-secondary",
    },
    {
      icon: Zap,
      title: "Video Games",
      description: "I enjoy playing various video games, from strategy to action games.",
      color: "text-primary",
    },
    {
      icon: Coffee,
      title: "Coffee Brewing",
      description: "I like making coffee and experimenting with different brewing methods.",
      color: "text-secondary",
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section ref={ref} className="py-20 px-4 relative bg-gradient-to-br from-muted/10 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Beyond <span className="text-secondary text-glow">Code</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            When I'm not coding, I enjoy various hobbies and activities. Here's a look at some of my personal interests
            and how they complement my professional work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gaming & Hobbies Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glassmorphism bg-card/10 border-border/30 overflow-hidden">
              {/* Gaming Visual */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Shield className="h-12 w-12 text-primary" />
                      <Code className="h-12 w-12 text-secondary" />
                      <Zap className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-lg">Gaming & Strategic Thinking</p>
                    <p className="text-sm text-muted-foreground mt-2">Table Tennis • Chess • Video Games</p>
                  </div>
                </div>

                {/* Activity Indicator */}
                <div className="absolute top-4 left-4 glassmorphism bg-card/20 px-3 py-1 rounded-full">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-4 bg-primary rounded-full animate-pulse" />
                    <span>Active Player</span>
                  </div>
                </div>
              </div>

              {/* Hobbies List */}
              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  Current Hobbies
                </h3>

                <div className="space-y-3">
                  {personalInterests.slice(0, 3).map((hobby, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="glassmorphism bg-card/5 p-4 rounded-lg border border-border/20 hover:bg-card/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="glassmorphism bg-card/20 p-2 rounded-lg">
                          <hobby.icon className={`h-5 w-5 ${hobby.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-semibold text-foreground">{hobby.title}</h4>
                          <p className="text-sm text-muted-foreground">{hobby.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personal Interests */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              Passions & Interests
            </h3>

            {/* Author Image in Passion Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8"
            >
              <Card className="glassmorphism bg-card/10 border-border/30 p-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src="/hero-img.jpeg"
                      alt="Shubham Bhasker - Developer & Musician"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 animate-pulse"></div>
                  </div>
                  <h4 className="font-serif font-semibold text-lg mb-2">Shubham Bhasker</h4>
                  <p className="text-muted-foreground text-sm">
                    When I'm not coding, I enjoy playing table tennis, chess, and video games.
                  </p>
                </div>
              </Card>
            </motion.div>

            {personalInterests.map((interest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="glassmorphism bg-card/10 border-border/30 p-6 hover:glow-amber transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="glassmorphism bg-card/20 p-3 rounded-lg">
                      <interest.icon className={`h-6 w-6 ${interest.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-semibold text-lg mb-2">{interest.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{interest.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Personal Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Card className="glassmorphism bg-gradient-to-br from-primary/10 to-secondary/10 border-border/30 p-8 text-center">
                <blockquote className="text-lg font-serif italic text-foreground mb-4">
                  "An inquisitive mind: The ultimate goal is to be better than yesterday, with a plan to improve tomorrow."
                </blockquote>
                <cite className="text-muted-foreground">- Shubham, Developer</cite>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Creative Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="glassmorphism bg-card/10 border-border/30 p-8 md:p-12">
            <h3 className="text-3xl font-serif font-bold mb-6">
              The Creative <span className="text-primary">Process</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-8">
              Whether I'm working on security projects or playing chess and table tennis, I try to approach things
              with curiosity and a willingness to learn. I find that the problem-solving skills I use in my hobbies
              often help me in my professional work as well.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="glassmorphism text-base px-4 py-2">
                Strategic Thinking
              </Badge>
              <Badge variant="outline" className="glassmorphism text-base px-4 py-2">
                Continuous Learning
              </Badge>
              <Badge variant="secondary" className="glassmorphism text-base px-4 py-2">
                Competitive Gaming
              </Badge>
              <Badge variant="outline" className="glassmorphism text-base px-4 py-2">
                Technical Innovation
              </Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Contact Section Component
function ContactSection() {
  const [showForm, setShowForm] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "shubhambhaskr123@gmail.com",
      href: "mailto:shubhambhaskr123@gmail.com",
      description: "Best for detailed project discussions",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "(+370) 63206160",
      href: "tel:+37063206160",
      description: "Quick calls and consultations",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kaunas, Lithuania",
      href: "#",
      description: "Available for local meetings",
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/0xDracarys",
      color: "hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/shubham-bhasker",
      color: "hover:text-blue-400",
    },
    {
      icon: Globe,
      label: "Portfolio",
      href: "https://zenithh.netlify.app/",
      color: "hover:text-green-400",
    },
    {
      icon: Shield,
      label: "Bugcrowd",
      href: "https://bugcrowd.com/0xDracarys",
      color: "hover:text-red-400",
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 relative bg-gradient-to-br from-muted/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Let's <span className="text-primary text-glow">Connect</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Interested in working together? Whether you have a project in mind or just want to discuss ideas, I'd be
            happy to help with your cybersecurity or development needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif font-bold mb-6">Get In Touch</h3>

            {contactMethods.map((method, index) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="glassmorphism bg-card/10 border-border/30 p-6 hover:glow-amber transition-all duration-300">
                  <a
                    href={method.href}
                    className="flex items-start gap-4 group"
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <div className="glassmorphism bg-card/20 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-semibold text-lg mb-1">{method.label}</h4>
                      <p className="text-foreground font-medium mb-1">{method.value}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </a>
                </Card>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-6"
            >
              <h4 className="font-serif font-semibold text-lg mb-4">Follow My Journey</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    className={`glassmorphism bg-card/10 border-border/30 p-4 rounded-lg hover:glow-amber transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center"
          >
            <Card className="glassmorphism bg-gradient-to-br from-primary/10 to-secondary/10 border-border/30 p-8 w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              </motion.div>

              <h3 className="text-3xl font-serif font-bold mb-4 text-center">
                Start Your <span className="text-primary">Project</span>
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 text-center">
                Have a project in mind? Let's discuss your requirements and see how I can help bring your ideas to life.
              </p>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="w-full glow hover:glow-amber transition-all duration-300 text-lg py-3"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Start Project Request
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full glassmorphism hover:glow-amber transition-all duration-300 bg-transparent text-lg py-3"
                  asChild
                >
                  <a href="mailto:shubhambhaskr123@gmail.com">
                    <Mail className="h-5 w-5 mr-2" />
                    Quick Email Instead
                  </a>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Free consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>24-hour response</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>NDA available</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Client Request Form Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="glassmorphism bg-card/95 border-border/50 max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif font-bold text-center">
                Let's Build Your <span className="text-primary">Project</span>
              </DialogTitle>
            </DialogHeader>
            <ClientRequestForm />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

// Website Settings Provider Component
function WebsiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [websiteSettings, setWebsiteSettings] = useState<any>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setWebsiteSettings(data.settings)
        }
      } catch (error) {
        console.error('Error fetching website settings:', error)
      } finally {
        setSettingsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Pass settings to children via context or props
  return (
    <div data-website-settings={JSON.stringify(websiteSettings)}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [websiteSettings, setWebsiteSettings] = useState<any>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setWebsiteSettings(data.settings)
        }
      } catch (error) {
        console.error('Error fetching website settings:', error)
      } finally {
        setSettingsLoading(false)
      }
    }

    const fetchActiveTheme = async () => {
      try {
        const response = await fetch('/api/themes')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.activeTheme) {
            applyThemeCSS(data.activeTheme)
          }
        }
      } catch (error) {
        console.error('Error fetching active theme:', error)
      }
    }

    fetchSettings()
    fetchActiveTheme()

    // Listen for settings updates from admin panel
    const handleSettingsUpdate = (event: CustomEvent) => {
      setWebsiteSettings(event.detail)
    }

    // Listen for theme updates from admin panel
    const handleThemeUpdate = (event: CustomEvent) => {
      applyThemeCSS(event.detail)
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener)
    window.addEventListener('themeUpdated', handleThemeUpdate as EventListener)

    // Refresh settings every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchSettings()
      fetchActiveTheme()
    }, 30000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener)
      window.removeEventListener('themeUpdated', handleThemeUpdate as EventListener)
    }
  }, [])

  const applyThemeCSS = (theme: any) => {
    // Remove existing theme styles
    const existingStyle = document.getElementById('dynamic-theme')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Generate comprehensive CSS from theme
    const css = `
      :root {
        --primary: ${theme.colors.primary};
        --secondary: ${theme.colors.secondary};
        --accent: ${theme.colors.accent};
        --background: ${theme.colors.background};
        --foreground: ${theme.colors.foreground};
        --muted: ${theme.colors.muted};
        --border: ${theme.colors.border};
        --card: ${theme.colors.card};
        --popover: ${theme.colors.popover};
        --destructive: ${theme.colors.destructive};
        --warning: ${theme.colors.warning};
        --success: ${theme.colors.success};
        
        --text-primary: ${theme.colors.textPrimary};
        --text-secondary: ${theme.colors.textSecondary};
        --text-muted: ${theme.colors.textMuted};
        --text-accent: ${theme.colors.textAccent};
        --text-inverse: ${theme.colors.textInverse};
        
        --font-family: ${theme.typography.fontFamily};
        --font-size-xs: ${theme.typography.fontSize.xs};
        --font-size-sm: ${theme.typography.fontSize.sm};
        --font-size-base: ${theme.typography.fontSize.base};
        --font-size-lg: ${theme.typography.fontSize.lg};
        --font-size-xl: ${theme.typography.fontSize.xl};
        --font-size-2xl: ${theme.typography.fontSize['2xl']};
        --font-size-3xl: ${theme.typography.fontSize['3xl']};
        --font-size-4xl: ${theme.typography.fontSize['4xl']};
        --font-size-5xl: ${theme.typography.fontSize['5xl']};
        --font-size-6xl: ${theme.typography.fontSize['6xl']};
        
        --font-weight-light: ${theme.typography.fontWeight.light};
        --font-weight-normal: ${theme.typography.fontWeight.normal};
        --font-weight-medium: ${theme.typography.fontWeight.medium};
        --font-weight-semibold: ${theme.typography.fontWeight.semibold};
        --font-weight-bold: ${theme.typography.fontWeight.bold};
        --font-weight-extrabold: ${theme.typography.fontWeight.extrabold};
        
        --border-radius: ${theme.layout.borderRadius};
        --spacing-xs: ${theme.layout.spacing.xs};
        --spacing-sm: ${theme.layout.spacing.sm};
        --spacing-md: ${theme.layout.spacing.md};
        --spacing-lg: ${theme.layout.spacing.lg};
        --spacing-xl: ${theme.layout.spacing.xl};
        --spacing-2xl: ${theme.layout.spacing['2xl']};
        
        --shadow-sm: ${theme.layout.shadows.sm};
        --shadow-md: ${theme.layout.shadows.md};
        --shadow-lg: ${theme.layout.shadows.lg};
        --shadow-xl: ${theme.layout.shadows.xl};
        
        --animation-duration: ${theme.animations.duration === 'fast' ? '150ms' : theme.animations.duration === 'slow' ? '500ms' : '300ms'};
        --animation-easing: ${theme.animations.easing};
      }
      
      ${theme.animations.enabled ? `
      * {
        transition: all var(--animation-duration) var(--animation-easing);
      }
      ` : ''}
      
      html {
        font-family: var(--font-family);
      }
      
      body {
        font-family: var(--font-family);
        background-color: var(--background) !important;
        color: var(--foreground) !important;
        transition: background-color var(--animation-duration) var(--animation-easing);
      }
      
      /* Apply theme to all elements */
      .bg-background {
        background-color: var(--background) !important;
      }
      
      .bg-muted {
        background-color: var(--muted) !important;
      }
      
      .bg-card {
        background-color: var(--card) !important;
      }
      
      .text-foreground {
        color: var(--foreground) !important;
      }
      
      .text-muted-foreground {
        color: var(--muted) !important;
      }
      
      .text-primary {
        color: var(--primary) !important;
      }
      
      .text-secondary {
        color: var(--secondary) !important;
      }
      
      .text-accent {
        color: var(--accent) !important;
      }
      
      .border-border {
        border-color: var(--border) !important;
      }
      
      .bg-primary {
        background-color: var(--primary) !important;
      }
      
      .bg-secondary {
        background-color: var(--secondary) !important;
      }
      
      .bg-accent {
        background-color: var(--accent) !important;
      }
      
      /* Glassmorphism effects with theme colors */
      .glassmorphism {
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      
      /* Glow effects with theme colors */
      .glow {
        box-shadow: 0 0 20px var(--primary) !important;
      }
      
      .glow-amber {
        box-shadow: 0 0 20px var(--accent) !important;
      }
      
      /* Ensure all text uses theme colors */
      h1, h2, h3, h4, h5, h6 {
        color: var(--foreground) !important;
      }
      
      p, span, div {
        color: var(--foreground) !important;
      }
      
      /* Button styles */
      button {
        font-family: var(--font-family) !important;
      }
      
      /* Input styles */
      input, textarea, select {
        font-family: var(--font-family) !important;
        background-color: var(--card) !important;
        color: var(--foreground) !important;
        border-color: var(--border) !important;
      }
    `

    // Add new theme styles
    const style = document.createElement('style')
    style.id = 'dynamic-theme'
    style.textContent = css
    document.head.appendChild(style)
    
    // Force a re-render by updating the body class
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${theme._id}`)
    
    console.log('Theme applied:', theme.name)
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />
        <WaterDropEffect />

        {/* 3D Canvas Background - Temporarily disabled for debugging */}
        {/* <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div> */}

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Glassmorphic Hero Card */}
            <Card className="glassmorphism bg-card/10 border-border/30 p-8 md:p-12 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8 flex justify-center"
              >
                <div className="relative">
                  <img
                    src={websiteSettings?.profile?.profileImage || "/hero-img.jpeg"}
                    alt={`${websiteSettings?.profile?.name || "Shubham Bhasker"} - ${websiteSettings?.profile?.title || "Cybersecurity Expert"}`}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/30 shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 animate-pulse"></div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-foreground"
              >
                Hello, I'm <span className="text-primary text-glow">{websiteSettings?.profile?.name?.split(' ')[0] || "Shubham"}</span>
              </motion.h1>

              <div className="mb-8 h-16 flex items-center justify-center">
                <AnimatedTagline websiteSettings={websiteSettings} />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                {websiteSettings?.profile?.bio || "Cybersecurity professional focused on building secure digital solutions. Currently working as Customer Success Manager at CyberCare (NordVPN), with experience in security research and bug hunting."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button size="lg" className="glow hover:glow-amber transition-all duration-300 text-lg px-8 py-3">
                  Explore My Work
                </Button>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="glassmorphism hover:glow-amber transition-all duration-300 bg-transparent"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glassmorphism hover:glow-amber transition-all duration-300 bg-transparent"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glassmorphism hover:glow-amber transition-all duration-300 bg-transparent"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
              About <span className="text-primary text-glow">Me</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                I'm Shubham Bhasker, a university student and cybersecurity professional working in security research and customer success. 
                Currently pursuing my Bachelor's in Information Systems & Cyber Security at Vilnius University while 
                working as a Customer Success Manager at CyberCare (NordVPN).
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                My interest in cybersecurity started with curiosity about how systems work. This led me to security 
                research and bug hunting, where I've gained experience in vulnerability assessment and security analysis.
              </p>
              <blockquote className="text-xl italic text-primary border-l-4 border-primary pl-6 mb-8">
                "Security is about understanding systems and staying informed about potential risks."
              </blockquote>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not working on security projects, I enjoy learning new technologies, contributing to open source 
                projects, and helping others in the security community. My approach focuses on systematic analysis and 
                continuous learning.
              </p>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <h3 className="text-3xl font-serif font-bold text-center mb-12">
              Technical <span className="text-secondary">Expertise</span>
            </h3>
            <SkillsVisualization />
          </motion.div>

          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-3xl font-serif font-bold text-center mb-12">
              Professional <span className="text-primary">Journey</span>
            </h3>
            <Timeline />
          </motion.div>
        </div>
      </section>

      {/* Projects Portfolio Section */}
      <ProjectsPortfolio />

      {/* Personal Showcase Section */}
      <PersonalShowcase />

      <ContactSection />
    </div>
  )
}
