import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h1 className="font-heading font-light text-5xl mb-4 tracking-tight">Emir Duruduygu</h1>
            <p className="text-muted-foreground mb-8 font-light">Architectural Photographer</p>
            <Button variant="outline" className="font-light tracking-wide bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="font-heading font-light text-2xl mb-8 tracking-wide">Experience</h2>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div
                    key={index}
                    className="border-l border-border pl-6 hover:border-foreground transition-colors duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{job.title}</h3>
                      <span className="text-sm text-muted-foreground font-light">{job.period}</span>
                    </div>
                    <p className="text-muted-foreground mb-2 font-light">{job.company}</p>
                    <p className="text-sm leading-relaxed font-light">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-heading font-light text-2xl mb-8 tracking-wide">Education</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-muted-foreground font-light">{edu.school}</p>
                    </div>
                    <span className="text-sm text-muted-foreground font-light">{edu.year}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-heading font-light text-2xl mb-8 tracking-wide">Skills</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {skills.map((skill, index) => (
                  <span key={index} className="font-light">
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
