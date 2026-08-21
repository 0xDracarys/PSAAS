"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientRequestForm } from "@/components/client-request-form"
import Chatbot from "@/components/chatbot"
import { GitHubProjects } from "@/components/github-projects"
import HeroConstellation from "@/components/hero-constellation"
import {
  Github,
  Linkedin,
  Mail,
  Code,
  Zap,
  ExternalLink,
  Eye,
  Puzzle,
  Pencil,
  Smartphone,
  Send,
  Phone,
  MapPin,
} from "lucide-react"

// Ambient scattered background particles
function AmbientParticleField() {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const particleColors = ["#8052ff", "#ffb829", "#15846e", "#e056fd", "#00d2d3"]
    const temp: any[] = []
    for (let i = 0; i < 40; i++) {
      temp.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 3,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: Math.random() * 0.3 + 0.08,
        duration: Math.random() * 25 + 20,
        delay: Math.random() * 10,
      })
    }
    setParticles(temp)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 0,
            height: 0,
            borderLeft: `${p.size / 2}px solid transparent`,
            borderRight: `${p.size / 2}px solid transparent`,
            borderBottom: `${p.size}px solid ${p.color}`,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -60, 0], rotate: [0, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  )
}

// Technical Skills Section (Dala Style — Floating on Black Void)
function TechnicalSkillsSection() {
  const skillsData = [
    { name: "Cybersecurity & Penetration Testing", level: 85, category: "Vulnerability Research" },
    { name: "Bug Hunting & Logic Fault Discovery", level: 90, category: "Bugcrowd Top 300" },
    { name: "Customer Success & Tier 2 Escalations", level: 95, category: "NordVPN / CyberCare" },
    { name: "Network Security & VPN Protocols", level: 88, category: "OpenVPN & NordLynx" },
    { name: "Python & Bash Automation Tools", level: 82, category: "Custom Scanners" },
    { name: "Log Diagnosis & API Diagnostics", level: 86, category: "REST APIs & Postman" },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        {skillsData.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-baseline">
              <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
                {skill.category}
              </span>
              <span className="text-[14px] font-semibold text-[#8052ff]">{skill.level}%</span>
            </div>
            <h4 className="text-[24px] md:text-[27px] font-normal tracking-[-0.48px] text-white">
              {skill.name}
            </h4>
            <div className="w-full h-[1px] bg-white/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{ duration: 1, delay: index * 0.08 + 0.2 }}
                className="h-full bg-gradient-to-r from-[#8052ff] to-[#ffb829]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Timeline Experience Component (Dala Floating Two-Column Layout)
function DalaTimeline() {
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessionalJourney = async () => {
      try {
        const response = await fetch("/api/settings/professional-journey")
        if (response.ok) {
          const data = await response.json()
          const transformedData = (data.experience || []).map((exp: any, index: number) => ({
            id: exp.id || `exp-${index}`,
            year: exp.duration?.split(" ")[0] || exp.duration || "2024",
            duration: exp.duration,
            title: exp.title,
            company: exp.company,
            description: exp.description,
            achievements: exp.achievements || [],
          }))
          setTimelineData(transformedData)
        }
      } catch (error) {
        console.error("Error fetching professional journey:", error)
        setTimelineData([
          {
            id: "exp_1",
            year: "2024",
            duration: "14/10/2024 – 15/01/2026",
            title: "Customer Success Manager",
            company: "CYBERCARE - NORDVPN",
            description:
              "Managing Tier 2 technical escalations at NordVPN, specializing in complex networking protocols and API-driven troubleshooting.",
            achievements: [
              "Integration & Troubleshooting: Rapidly progressed to Tier 2 escalations, resolving complex connectivity and system configuration issues.",
              "Protocol Expertise: Mastered technical implementation and troubleshooting of VPN protocols (NordLynx, OpenVPN) and TCP/IP.",
              "Log Analysis & Diagnosis: Analyze system logs to identify root causes for connectivity failures in highly restricted regions.",
              "API & Tooling: Use manual connection setups and custom configurations to bypass network restrictions.",
              "Process Improvement: Document software bugs in Jira for developer-led remediation.",
              "Utilized Zendesk to manage support operations, ensuring a 95% SLA adherence for ticket resolution.",
            ],
          },
          {
            id: "exp_2",
            year: "2020",
            duration: "05/09/2020 – Current",
            title: "Freelance Security Researcher",
            company: "BUGCROWD",
            description:
              "Vulnerability research, bug bounty discovery, and technical security documentation.",
            achievements: [
              "System Reliability & Logic: Ranked in the Top 300 globally for identifying critical logic and integration flaws (Broken Authentication & IDOR).",
              "API Security: Test and troubleshoot web interfaces using Postman and cURL to identify insecure data handling.",
              "Automation: Developed a micro bug scanner in Python and Bash to automate access control flaw detection.",
              "Reporting: Deliver detailed technical documentation and remediation steps for financial and e-commerce platforms.",
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProfessionalJourney()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8052ff]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-24">
      {timelineData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: index * 0.15 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          {/* Year & Company (Left Col - 5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
              {item.company}
            </span>
            <h3 className="text-[78px] font-normal tracking-[-3.12px] text-white leading-none">
              {item.year}
            </h3>
            <p className="text-[14px] text-[#9a9a9a] font-normal">{item.duration}</p>
          </div>

          {/* Details (Right Col - 7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-[36px] font-normal tracking-[-1.68px] text-white">
              {item.title}
            </h3>
            <p className="text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]">
              {item.description}
            </p>

            {item.achievements && item.achievements.length > 0 && (
              <ul className="space-y-3 pt-2">
                {item.achievements.map((achievement: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-[15px] font-extralight text-[#9a9a9a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] mt-2 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Project Card Component (Dala Monolithic Number Editorial Layout - Refero/MotionSites Inspired)
function DalaProjectCard({ project, index }: { project: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-12 border-b border-white/10 group"
    >
      {/* Oversized Monolithic Number & Category (Left 3 cols) */}
      <div className="md:col-span-3 space-y-2">
        <div className="text-[72px] md:text-[96px] font-normal tracking-[-4px] text-white/90 leading-none group-hover:text-[#ffb829] transition-colors duration-500 font-mono">
          0{index + 1}
        </div>
        <span className="inline-block text-[11px] font-mono text-[#8052ff] uppercase tracking-[0.25em] border border-[#8052ff]/30 px-3 py-1 rounded-full bg-[#8052ff]/10">
          {project.tags?.[0] || "SECURITY TOOLING"}
        </span>
      </div>

      {/* Main Project Content (Right 9 cols) */}
      <div className="md:col-span-9 space-y-5">
        <h3
          className="text-[32px] md:text-[44px] font-normal tracking-[-1.8px] text-white hover:text-[#8052ff] transition-colors cursor-pointer leading-[1.1]"
          onClick={() => setIsOpen(true)}
        >
          {project.title}
        </h3>

        <p className="text-[16px] md:text-[18px] font-extralight leading-[1.6] text-[#bdbdbd] max-w-3xl">
          {project.description}
        </p>

        {project.features && project.features.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[13px] text-white/70 font-extralight">
            {project.features.slice(0, 3).map((feat: string, fIdx: number) => (
              <div key={fIdx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb829]" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags?.slice(0, 5).map((tag: string) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-[#9a9a9a] uppercase tracking-[0.18em] bg-white/5 px-3 py-1 rounded-md border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 pt-4">
          <button
            onClick={() => setIsOpen(true)}
            className="dala-btn-primary py-2.5 px-6 text-[13px]"
          >
            <Eye className="h-4 w-4" /> View Details
          </button>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9a9a9a] hover:text-white text-[13px] font-semibold uppercase tracking-[0.35px] transition-colors"
            >
              <Github className="h-4 w-4" /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9a9a9a] hover:text-white text-[13px] font-semibold uppercase tracking-[0.35px] transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black text-white max-w-3xl border border-white/20 rounded-[24px] p-8 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[36px] font-normal tracking-[-1.68px] text-white mb-2">
              {project.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div>
              <h4 className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-2">Overview</h4>
              <p className="text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]">{project.description}</p>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {project.features.map((feat: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-3 text-[15px] font-extralight text-[#9a9a9a]">
                      <Zap className="h-4 w-4 text-[#8052ff] mt-1 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dala-btn-primary flex-1 text-center"
                >
                  Live Demo <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-white/20 hover:border-white text-white text-[14px] font-semibold uppercase tracking-[0.35px] rounded-[22.5px] px-6 py-3 transition-colors flex-1"
                >
                  GitHub <Github className="h-4 w-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Main Projects Portfolio Component
function ProjectsPortfolio() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fallbackProjects = [
    {
      id: 1,
      title: "Vulnerability Assessment Platform",
      description:
        "Automated vulnerability scanning and assessment tool designed for comprehensive security analysis. Features real-time threat detection, detailed reporting, and integration with security frameworks.",
      image: "/cybersecurity-vulnerability-assessment-dashboard-w.jpg",
      tags: ["Python", "Django", "PostgreSQL", "Security", "Automation"],
      github: "https://github.com/0xDracarys/vulnerability-platform",
      demo: "https://vuln-platform-demo.netlify.app",
      features: [
        "Automated vulnerability scanning",
        "Real-time threat detection",
        "Comprehensive security reports",
        "Framework integration",
      ],
    },
    {
      id: 2,
      title: "Bugcrowd Analytics Dashboard",
      description:
        "Advanced analytics platform for bug bounty programs with data visualization, performance tracking, and automated reporting. Helps researchers optimize security workflows.",
      image: "/bug-bounty-analytics-dashboard-with-charts-and-gra.jpg",
      tags: ["React", "Node.js", "MongoDB", "Analytics", "D3.js"],
      github: "https://github.com/0xDracarys/bugcrowd-analytics",
      demo: "https://bugcrowd-analytics-demo.netlify.app",
      features: [
        "Real-time analytics dashboard",
        "Performance tracking metrics",
        "Automated report generation",
      ],
    },
    {
      id: 3,
      title: "TryHackMe Progress Tracker",
      description:
        "Personal tracking system for TryHackMe progress with advanced analytics, goal setting, and performance visualization. Helped achieve Top 300 global ranking.",
      image: "/tryhackme-progress-tracker-with-leaderboard-and-st.jpg",
      tags: ["Python", "Selenium", "FastAPI", "Automation"],
      github: "https://github.com/0xDracarys/tryhackme-tracker",
      demo: "https://tryhackme.com/p/ShubhamBhasker",
      features: [
        "Progress monitoring",
        "Rank tracking metrics",
        "Achievement visualization",
      ],
    },
  ]

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?active=true")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.projects?.length > 0) {
            setProjects(
              data.projects.map((p: any) => ({
                id: p._id || p.id,
                title: p.title,
                description: p.description,
                image: p.image,
                tags: p.tags || [],
                github: p.github,
                demo: p.demo,
                features: p.features || [],
              }))
            )
          } else {
            setProjects(fallbackProjects)
          }
        } else {
          setProjects(fallbackProjects)
        }
      } catch {
        setProjects(fallbackProjects)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
      <div className="space-y-4 mb-20">
        <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
          SELECTED WORKS
        </span>
        <h2 className="text-[48px] md:text-[78px] font-normal tracking-[-3.12px] text-white">
          Security Engineering.
        </h2>
        <p className="text-[18px] font-extralight text-[#bdbdbd] max-w-xl">
          Security scanners, logic fault detection tooling, and custom diagnostic platforms.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8052ff]" />
        </div>
      ) : (
        <div>
          {projects.map((project, index) => (
            <DalaProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}

// Personal Interests Section (Dala Ghost Text Floating)
function DalaPersonalInterests() {
  const interests = [
    {
      title: "Rubik's Cube",
      description: "Solving 3x3 and high-order cubes keeps my analytical pattern recognition sharp.",
      icon: Puzzle,
    },
    {
      title: "Sketching",
      description: "Detailed graphite sketching allows me to slow down and observe structure in depth.",
      icon: Pencil,
    },
    {
      title: "Table Tennis",
      description: "Fast-paced rallies requiring instant reactions and strategic placement.",
      icon: Zap,
    },
    {
      title: "Mobile Gaming",
      description: "Unwinding with tactical strategy games and puzzles.",
      icon: Smartphone,
    },
  ]

  return (
    <section className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5 space-y-4">
          <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
            BEYOND THE CODE
          </span>
          <h2 className="text-[42px] md:text-[48px] font-normal tracking-[-1.68px] text-white">
            Personal Pursuits.
          </h2>
          <p className="text-[18px] font-extralight text-[#bdbdbd]">
            "An inquisitive mind: The ultimate goal is to be better than yesterday, with a plan to improve tomorrow."
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
          {interests.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <item.icon className="h-6 w-6 text-[#8052ff]" />
              <h3 className="text-[27px] font-normal tracking-[-0.48px] text-white">{item.title}</h3>
              <p className="text-[18px] font-extralight text-[#9a9a9a] leading-[1.5]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section (Dala Pure Void Layout with Inline Form)
function DalaContactSection() {
  const [showForm, setShowForm] = useState(false)
  const [quickForm, setQuickForm] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickForm.name || !quickForm.email || !quickForm.message) {
      setSubmitStatus({ type: "error", msg: "Please fill out all fields." })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/client-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quickForm.name,
          email: quickForm.email,
          requirements: quickForm.message,
          projectType: "Direct Contact Form",
        }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setSubmitStatus({ type: "success", msg: "Message sent successfully! Shubham will reach out to you soon." })
        setQuickForm({ name: "", email: "", message: "" })
      } else {
        setSubmitStatus({ type: "error", msg: data.error || "Failed to send message. Please try again." })
      }
    } catch (err) {
      setSubmitStatus({ type: "error", msg: "An unexpected error occurred. Please try emailing directly." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
            GET IN TOUCH
          </span>
          <h2 className="text-[48px] md:text-[96px] font-normal tracking-[-3.84px] text-white leading-[0.95]">
            Let's Talk.
          </h2>
          <p className="text-[18px] font-extralight text-[#bdbdbd] max-w-xl">
            Interested in security research, penetration testing, or custom web application development? Drop a line to start a conversation.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 text-[18px] font-extralight text-[#ffffff]">
              <Mail className="h-5 w-5 text-[#8052ff]" />
              <a href="mailto:shubhambhaskr123@gmail.com" className="hover:text-[#8052ff] transition-colors">
                shubhambhaskr123@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-4 text-[18px] font-extralight text-[#ffffff]">
              <Phone className="h-5 w-5 text-[#8052ff]" />
              <a href="tel:+37063979268" className="hover:text-[#8052ff] transition-colors">
                +370 63979268
              </a>
            </div>
            <div className="flex items-center gap-4 text-[18px] font-extralight text-[#bdbdbd]">
              <MapPin className="h-5 w-5 text-[#8052ff]" />
              <span>Vilnius / Kaunas, Lithuania</span>
            </div>
          </div>
        </div>

        {/* Right Column Inline Contact Form (6 cols) */}
        <div className="md:col-span-6 bg-[#0c0c0e]/80 border border-white/10 p-8 rounded-[24px] backdrop-blur-md space-y-6 shadow-2xl">
          <h3 className="text-[24px] font-normal text-white">Send a Message</h3>

          {submitStatus && (
            <div
              className={`p-4 rounded-xl text-sm ${
                submitStatus.type === "success"
                  ? "bg-[#15846e]/20 border border-[#15846e] text-emerald-300"
                  : "bg-red-950/30 border border-red-500/50 text-red-300"
              }`}
            >
              {submitStatus.msg}
            </div>
          )}

          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={quickForm.name}
                onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                placeholder="Shubham Bhasker"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8052ff] transition-colors text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={quickForm.email}
                onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                placeholder="shubham@example.com"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8052ff] transition-colors text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-2">
                Message / Details *
              </label>
              <textarea
                required
                rows={4}
                value={quickForm.message}
                onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                placeholder="Tell me about your project, timeline, or security inquiry..."
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8052ff] transition-colors text-[15px] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="dala-btn-primary w-full justify-center py-4 text-[14px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-[13px] font-semibold uppercase tracking-[0.35px] text-[#8052ff] hover:text-[#a57bff] transition-colors inline-flex items-center"
            >
              Need a structured project intake proposal? Open Full Form →
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-black text-white max-w-4xl border border-white/20 rounded-[24px] p-8 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[36px] font-normal tracking-[-1.68px] text-white text-center mb-4">
              Detailed Project Intake Form
            </DialogTitle>
          </DialogHeader>
          <ClientRequestForm />
        </DialogContent>
      </Dialog>
    </section>
  )
}

// MAIN LANDING PAGE
export default function HomePage() {
  const [websiteSettings, setWebsiteSettings] = useState<any>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          setWebsiteSettings(data.settings)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  const profileName =
    websiteSettings?.profile?.name && websiteSettings.profile.name !== "Sam"
      ? websiteSettings.profile.name
      : "Shubham Bhasker"
  const profileTitle = websiteSettings?.profile?.title || "Security Engineer & Bug Hunter"
  const profileBio =
    websiteSettings?.profile?.bio ||
    "Security researcher by night, tech problem-solver by day. Ranked Top 300 globally on Bugcrowd. If there's a security flaw, network bug, or broken API in your stack, I'm the guy who finds and fixes it."

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fixed full-page particle constellation — scroll-driven transformations */}
      <HeroConstellation />

      {/* Background ambient floating particles */}
      <AmbientParticleField />

      {/* All content sits above the constellation canvas */}
      <div className="relative" style={{ zIndex: 1 }}>

      {/* HERO SECTION — Full-width Void Layout with constellation in background */}
      <section className="min-h-[calc(100vh-100px)] flex items-end max-w-[1280px] mx-auto px-6 pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl space-y-8"
        >
          <div className="space-y-3">
            <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
              HEY THERE, I'M {profileName.toUpperCase()}
            </span>
            <h1 className="text-[56px] sm:text-[78px] lg:text-[113px] font-normal tracking-[-4.52px] text-white leading-[0.92] select-none">
              I break code so you don't have to.
            </h1>
          </div>

          <p className="text-[18px] font-extralight leading-[1.5] text-[#ffffff] max-w-xl">
            {profileBio}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a href="#projects" className="dala-btn-primary">
              Explore Work
            </a>
            <div className="flex items-center gap-6">
              <a href="https://github.com/0xDracarys" target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/shubham-bhasker-63846a203/" target="_blank" rel="noopener noreferrer" className="text-[#9a9a9a] hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:shubhambhaskr123@gmail.com" className="text-[#9a9a9a] hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ABOUT / TEAM MEMBER CARD SECTION */}
      <section id="about" className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          {/* Portrait Photo (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <div className="relative rounded-[24px] overflow-hidden bg-black border border-white/10">
              <img
                src={websiteSettings?.profile?.profileImage || "/hero-img.jpeg"}
                alt={profileName}
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="p-5 bg-[#0c0c0e]">
                <span className="text-[12px] font-semibold tracking-[0.35px] uppercase text-[#8052ff]">
                  SECURITY ENGINEER & BUG HUNTER
                </span>
                <h3 className="text-[24px] font-normal text-white mt-1">{profileName}</h3>
              </div>
            </div>
          </motion.div>

          {/* Bio & Background (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 space-y-6"
          >
            <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
              WHO I AM
            </span>
            <h2 className="text-[42px] md:text-[78px] font-normal tracking-[-3.12px] text-white leading-[1.0]">
              I learn how systems work by figuring out how to break them.
            </h2>
            <p className="text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]">
              By day, I handle tough technical escalations at CyberCare (NordVPN) — diagnosing networking protocols, analyzing connection logs, and debugging API workflows when standard support hits a wall.
            </p>
            <p className="text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]">
              On Bugcrowd, I rank in the Top 300 globally for hunting critical security bugs (Broken Auth, IDOR). Writing custom Python & Bash micro-scanners lets me find holes before the bad guys do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TECHNICAL EXPERTISE */}
      <section className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
        <div className="space-y-4 mb-20">
          <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
            WHAT I ACTUALLY DO
          </span>
          <h2 className="text-[48px] md:text-[78px] font-normal tracking-[-3.12px] text-white">
            Core Skills.
          </h2>
        </div>
        <TechnicalSkillsSection />
      </section>

      {/* PROFESSIONAL JOURNEY / EXPERIENCE */}
      <section id="experience" className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
        <div className="space-y-4 mb-20">
          <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
            WHERE I'VE BEEN
          </span>
          <h2 className="text-[48px] md:text-[78px] font-normal tracking-[-3.12px] text-white">
            Work History.
          </h2>
        </div>
        <DalaTimeline />
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
        <div className="space-y-4 mb-20">
          <span className="text-[14px] font-semibold tracking-[0.35px] uppercase text-[#ffb829]">
            STUFF I'VE BUILT
          </span>
          <h2 className="text-[48px] md:text-[78px] font-normal tracking-[-3.12px] text-white">
            Featured Projects.
          </h2>
          <p className="text-[18px] font-extralight text-[#bdbdbd] max-w-xl">
            Security tools, automation scripts, and custom web apps built to solve real problems.
          </p>
        </div>
        <ProjectsPortfolio />
      </section>

      {/* GITHUB INTEGRATION */}
      <section className="py-24 md:py-36 max-w-[1280px] mx-auto px-6">
        <GitHubProjects />
      </section>

      {/* PERSONAL INTERESTS */}
      <DalaPersonalInterests />

      {/* CONTACT & INTAKE */}
      <DalaContactSection />

      {/* INTEGRATED CHATBOT */}
      <Chatbot />

      </div>{/* end relative z-1 wrapper */}
    </div>
  )
}
