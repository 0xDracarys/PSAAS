// API route for handling website settings
// Connected to MongoDB Atlas

import { type NextRequest, NextResponse } from "next/server"

// GET - Retrieve website settings
export async function GET(request: NextRequest) {
  try {
    // Use MongoDB service directly
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    let settings = await mongoService.getWebsiteSettings()

    // If no settings exist, create default settings
    if (!settings) {
      console.log("No website settings found, creating default settings...")
      const defaultSettings = {
        profile: {
          name: 'Shubham Bhasker',
          title: 'Cybersecurity Expert & Full-Stack Developer',
          bio: 'Passionate cybersecurity professional with expertise in vulnerability assessment, penetration testing, and secure web development.',
          location: 'Kaunas, Lithuania',
          email: 'shubham@example.com',
          phone: '+370-612-34567',
          profileImage: '/hero-img.jpeg',
          coverImage: '/hero-img.jpeg'
        },
        experience: [
          {
            title: 'Senior Cybersecurity Consultant',
            company: 'TechCorp Solutions',
            duration: '2022 - Present',
            description: 'Leading security assessments and implementing security frameworks for enterprise clients.',
            achievements: [
              'Reduced security vulnerabilities by 85% across client portfolios',
              'Implemented zero-trust architecture for 50+ organizations',
              'Led team of 12 security professionals'
            ]
          },
          {
            title: 'Penetration Tester',
            company: 'SecureNet Inc',
            duration: '2020 - 2022',
            description: 'Conducted comprehensive security assessments and vulnerability testing.',
            achievements: [
              'Identified 200+ critical security vulnerabilities',
              'Developed automated testing tools used by 100+ security teams',
              'Achieved 99.8% client satisfaction rate'
            ]
          }
        ],
        skills: [
          { name: 'Penetration Testing', level: 95, category: 'Security' },
          { name: 'Vulnerability Assessment', level: 90, category: 'Security' },
          { name: 'Security Architecture', level: 88, category: 'Security' },
          { name: 'React/Next.js', level: 85, category: 'Frontend' },
          { name: 'Node.js', level: 80, category: 'Backend' },
          { name: 'Python', level: 85, category: 'Programming' },
          { name: 'AWS Security', level: 82, category: 'Cloud' },
          { name: 'Docker', level: 75, category: 'DevOps' }
        ],
        socialLinks: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/sam-cybersecurity', icon: 'linkedin' },
          { platform: 'GitHub', url: 'https://github.com/sam-cyber', icon: 'github' },
          { platform: 'Twitter', url: 'https://twitter.com/sam_cyber', icon: 'twitter' },
          { platform: 'Email', url: 'mailto:shubham@example.com', icon: 'mail' }
        ],
        personalInterests: [
          { title: 'Cybersecurity Research', description: 'Staying updated with latest security threats and defense mechanisms' },
          { title: 'Open Source Contributions', description: 'Contributing to security tools and frameworks' },
          { title: 'Tech Blogging', description: 'Writing about cybersecurity best practices and trends' },
          { title: 'Mentoring', description: 'Helping junior developers learn security practices' }
        ],
        musicTracks: [
          { title: 'Coding Focus', artist: 'Lofi Hip Hop', duration: '2:30', genre: 'Instrumental' },
          { title: 'Deep Work', artist: 'Ambient Sounds', duration: '3:45', genre: 'Ambient' },
          { title: 'Security Mindset', artist: 'Electronic', duration: '4:12', genre: 'Electronic' }
        ],
        contactInfo: {
          email: 'shubham@example.com',
          phone: '+370-612-34567',
          location: 'Kaunas, Lithuania',
          availability: 'Available for freelance projects',
          responseTime: 'Usually responds within 24 hours'
        }
      }
      
      // Create the default settings
      await mongoService.updateWebsiteSettings(defaultSettings)
      settings = await mongoService.getWebsiteSettings()
    }

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("[API] Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT - Update website settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Use MongoDB service directly
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    // TODO: Add authentication middleware for admin access
    const success = await mongoService.updateWebsiteSettings(body)

    if (!success) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    console.log("[API] Settings updated:", body)

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
