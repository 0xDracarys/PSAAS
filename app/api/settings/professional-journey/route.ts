import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';

export const dynamic = 'force-dynamic';

interface Experience {
  id?: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface ProfessionalJourneySettings {
  experience: Experience[];
}

// GET - Fetch professional journey data
export async function GET() {
  try {
    const settings = await dbService.getWebsiteSettings();
    
    const professionalJourney: ProfessionalJourneySettings = {
      experience: settings?.experience || [
        {
          id: '1',
          title: "Senior Cybersecurity Consultant",
          company: "TechCorp Solutions",
          duration: "2022 - Present",
          description: "Leading security assessments and implementing security frameworks for enterprise clients.",
          achievements: [
            "Reduced security vulnerabilities by 85% across client portfolios",
            "Implemented zero-trust architecture for 50+ organizations",
            "Led team of 12 security professionals"
          ]
        },
        {
          id: '2',
          title: "Penetration Tester",
          company: "SecureNet Inc",
          duration: "2020 - 2022",
          description: "Conducted comprehensive security assessments and vulnerability testing.",
          achievements: [
            "Identified 200+ critical security vulnerabilities",
            "Developed automated testing tools used by 100+ security teams",
            "Achieved 99.8% client satisfaction rate"
          ]
        }
      ]
    };

    // Add IDs if missing
    professionalJourney.experience = professionalJourney.experience.map((exp, index) => ({
      ...exp,
      id: exp.id || `exp-${index + 1}`
    }));

    return NextResponse.json(professionalJourney);
  } catch (error) {
    console.error('Error fetching professional journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch professional journey data' },
      { status: 500 }
    );
  }
}

// PUT - Update professional journey data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { experience } = body as ProfessionalJourneySettings;

    if (!experience || !Array.isArray(experience)) {
      return NextResponse.json(
        { error: 'Invalid experience data format' },
        { status: 400 }
      );
    }

    // Validate each experience entry
    for (const exp of experience) {
      if (!exp.title || !exp.company || !exp.duration) {
        return NextResponse.json(
          { error: 'Each experience must have title, company, and duration' },
          { status: 400 }
        );
      }
      if (!Array.isArray(exp.achievements)) {
        return NextResponse.json(
          { error: 'Achievements must be an array' },
          { status: 400 }
        );
      }
    }

    // Get current settings
    const currentSettings = await dbService.getWebsiteSettings();

    // Update experience in settings
    const updatedSettings = {
      ...currentSettings,
      experience: experience.map((exp, index) => ({
        ...exp,
        id: exp.id || `exp-${index + 1}`
      }))
    };

    // Save to database
    await dbService.updateWebsiteSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: 'Professional journey updated successfully',
      experience: updatedSettings.experience
    });
  } catch (error) {
    console.error('Error updating professional journey:', error);
    return NextResponse.json(
      { error: 'Failed to update professional journey data' },
      { status: 500 }
    );
  }
}
