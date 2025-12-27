import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Download, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional experience and background of Emir Duruduygu.",
}

const experience = [
  {
    title: "Senior Architectural Photographer",
    company: "Studio Modernist",
    period: "2022 - Present",
    description: "Lead photographer specializing in contemporary architecture and urban design documentation.",
  },
  {
    title: "Photography Director",
    company: "Urban Lens Collective",
    period: "2020 - 2022",
    description: "Directed photography projects for architectural publications and design magazines.",
  },
  {
    title: "Freelance Photographer",
    company: "Independent",
    period: "2018 - 2020",
    description: "Architectural photography services across North America and Europe.",
  },
]

const education = [
  {
    degree: "MFA Photography",
    school: "Rhode Island School of Design",
    year: "2018",
  },
  {
    degree: "Bachelor of Architecture",
    school: "UC Berkeley",
    year: "2016",
  },
]

const skills = [
  "Architectural Photography",
  "Digital Post-Processing",
  "Lighting Design",
  "3D Visualization",
  "Adobe Creative Suite",
  "Project Management",
]

export default function ResumePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-16 lg:mb-24">
            <span className="font-mono text-sm tracking-wider text-accent uppercase block mb-4">
              Resume
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Emir Duruduygu
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Architectural Photographer & Visual Storyteller
            </p>
            <button className="group inline-flex items-center gap-3 text-foreground font-medium">
              <Download className="w-5 h-5" />
              <span className="relative">
                Download CV
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
              </span>
            </button>
          </div>

          <div className="space-y-20 lg:space-y-28">
            {/* Experience */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Experience</h2>
                <span className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-10">
                {experience.map((job, index) => (
                  <div
                    key={index}
                    className="group grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8"
                  >
                    <div className="md:col-span-1">
                      <span className="font-mono text-sm text-muted-foreground">{job.period}</span>
                    </div>
                    <div className="md:col-span-3 border-l-2 border-border group-hover:border-accent pl-6 transition-colors duration-300">
                      <h3 className="font-serif text-xl text-foreground mb-1">{job.title}</h3>
                      <p className="text-accent font-medium mb-3">{job.company}</p>
                      <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Education</h2>
                <span className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 py-4 border-b border-border last:border-0"
                  >
                    <div className="md:col-span-1">
                      <span className="font-mono text-sm text-muted-foreground">{edu.year}</span>
                    </div>
                    <div className="md:col-span-3">
                      <h3 className="font-serif text-lg text-foreground">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Skills</h2>
                <span className="flex-1 h-px bg-border" />
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="font-mono text-sm px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
