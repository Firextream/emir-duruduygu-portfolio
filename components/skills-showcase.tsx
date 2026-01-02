"use client"

import { cn } from "@/lib/utils"
import { 
  Camera, 
  Cpu, 
  Code, 
  Lightbulb,
  Palette,
  Globe,
  Zap,
  BookOpen,
  Wrench,
  Terminal,
  Database,
  Smartphone
} from "lucide-react"

interface Skill {
  name: string
  level: number // 0-100
  category: "technical" | "creative" | "soft"
  icon?: React.ReactNode
}

const skills: Skill[] = [
  // Technical
  { name: "C++", level: 75, category: "technical", icon: <Code className="w-4 h-4" /> },
  { name: "Python", level: 70, category: "technical", icon: <Terminal className="w-4 h-4" /> },
  { name: "MATLAB", level: 65, category: "technical", icon: <Database className="w-4 h-4" /> },
  { name: "Circuit Design", level: 60, category: "technical", icon: <Cpu className="w-4 h-4" /> },
  { name: "Embedded Systems", level: 55, category: "technical", icon: <Smartphone className="w-4 h-4" /> },
  { name: "Web Development", level: 50, category: "technical", icon: <Globe className="w-4 h-4" /> },
  
  // Creative
  { name: "Photography", level: 80, category: "creative", icon: <Camera className="w-4 h-4" /> },
  { name: "Photo Editing", level: 75, category: "creative", icon: <Palette className="w-4 h-4" /> },
  { name: "Composition", level: 70, category: "creative", icon: <Lightbulb className="w-4 h-4" /> },
  { name: "Color Grading", level: 65, category: "creative", icon: <Palette className="w-4 h-4" /> },
  
  // Soft Skills
  { name: "Problem Solving", level: 85, category: "soft", icon: <Zap className="w-4 h-4" /> },
  { name: "Self Learning", level: 90, category: "soft", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Adaptability", level: 80, category: "soft", icon: <Wrench className="w-4 h-4" /> },
]

interface Tool {
  name: string
  icon?: string
  category: string
}

const tools: Tool[] = [
  { name: "VS Code", category: "Development" },
  { name: "Adobe Lightroom", category: "Photography" },
  { name: "Adobe Photoshop", category: "Photography" },
  { name: "Figma", category: "Design" },
  { name: "Git", category: "Development" },
  { name: "Arduino", category: "Electronics" },
  { name: "KiCad", category: "Electronics" },
  { name: "MATLAB", category: "Engineering" },
  { name: "Notion", category: "Productivity" },
]

interface SkillsShowcaseProps {
  className?: string
  variant?: "full" | "compact"
}

export function SkillsShowcase({ className, variant = "full" }: SkillsShowcaseProps) {
  const technicalSkills = skills.filter(s => s.category === "technical")
  const creativeSkills = skills.filter(s => s.category === "creative")
  const softSkills = skills.filter(s => s.category === "soft")

  if (variant === "compact") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 8).map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
            >
              {skill.icon}
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-12", className)}>
      {/* Technical Skills */}
      <div>
        <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Technical Skills
        </h3>
        <div className="space-y-4">
          {technicalSkills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Creative Skills */}
      <div>
        <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Creative Skills
        </h3>
        <div className="space-y-4">
          {creativeSkills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Soft Skills
        </h3>
        <div className="space-y-4">
          {softSkills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Tools & Software */}
      <div>
        <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          Tools & Software
        </h3>
        <div className="flex flex-wrap gap-3">
          {tools.map((tool) => (
            <span
              key={tool.name}
              className="px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:border-accent/50 transition-colors"
            >
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {skill.icon && <span className="text-muted-foreground">{skill.icon}</span>}
          <span className="text-sm font-medium text-foreground">{skill.name}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )
}

// Mini skills list for resume or sidebar
export function SkillsList({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Languages</p>
        <p className="text-sm text-foreground">C++, Python, MATLAB, JavaScript</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Tools</p>
        <p className="text-sm text-foreground">VS Code, Git, Arduino, Adobe Suite</p>
      </div>
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Interests</p>
        <p className="text-sm text-foreground">Photography, Electronics, Web Development</p>
      </div>
    </div>
  )
}
