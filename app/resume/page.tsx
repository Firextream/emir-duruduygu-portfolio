import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Download, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional experience and background of Duruduygu.",
}

const experience = [
  {
    title: "Electronic Team Member",
    company: "ITU ROV Team",
    period: "Oct 2024 - Present",
    description: "Actively contributing to the electronics sub-team for the design of remotely operated underwater vehicles.",
  },
]

const education = [
  {
    degree: "B.Sc. in Electrical & Electronics Engineering",
    school: "Istanbul Technical University",
    year: "Present",
    details: "Relevant Coursework: Circuit Analysis, Digital Logic Design, C++ Programming.",
  },
]

const skills = {
  technical: [
    "C++",
    "MATLAB",
    "Python",
  ],
  ai: [
    "Generative AI",
    "Prompt Engineering",
  ],
  creative: [
    "Adobe Photoshop",
    "Adobe Premiere Pro",
  ],
  core: [
    "Project Management",
    "Problem Solving",
  ],
}

const creativeInterests = {
  title: "Amateur Photography",
  period: "Aug 2025 - Present",
  description: "Exploring street and architectural photography, capturing everyday moments and urban landscapes.",
}

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
              Duruduygu
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Electrical & Electronics Engineering Student · Istanbul, Turkey
            </p>
            <a 
              href="/Emir_Duruduygu_CV.pdf" 
              download
              className="group inline-flex items-center gap-3 text-foreground font-medium hover:text-accent transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="relative">
                Download CV
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
              </span>
            </a>
          </div>

          <div className="space-y-20 lg:space-y-28">
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
                      <p className="text-accent font-medium">{edu.school}</p>
                      {edu.details && (
                        <p className="text-muted-foreground text-sm mt-2">{edu.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

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

            {/* Creative Interests */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Creative Interests</h2>
                <span className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                <div className="md:col-span-1">
                  <span className="font-mono text-sm text-muted-foreground">{creativeInterests.period}</span>
                </div>
                <div className="md:col-span-3 border-l-2 border-accent pl-6">
                  <h3 className="font-serif text-xl text-foreground mb-2">{creativeInterests.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{creativeInterests.description}</p>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Skills</h2>
                <span className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-8">
                {/* Technical & Engineering */}
                <div>
                  <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-4">Technical & Engineering</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.technical.map((skill, index) => (
                      <span 
                        key={index} 
                        className="font-mono text-sm px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* AI & Innovation */}
                <div>
                  <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-4">AI & Innovation</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.ai.map((skill, index) => (
                      <span 
                        key={index} 
                        className="font-mono text-sm px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Creative & Software */}
                <div>
                  <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-4">Creative & Software</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.creative.map((skill, index) => (
                      <span 
                        key={index} 
                        className="font-mono text-sm px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Core Skills */}
                <div>
                  <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-4">Core Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.core.map((skill, index) => (
                      <span 
                        key={index} 
                        className="font-mono text-sm px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
