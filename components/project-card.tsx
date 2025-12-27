import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface Project {
  id: string
  title: string
  imageUrl: string
  category?: string
  slug?: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const href = project.slug ? `/portfolio/${project.slug}` : "/gallery"

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden bg-secondary">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
          
          {/* Arrow Icon on Hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 bg-background flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-foreground" />
            </div>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="p-4 bg-card border border-t-0 border-border">
          {project.category && (
            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {project.category}
            </span>
          )}
          <h3 className="font-serif text-xl text-foreground mt-1 group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </article>
    </Link>
  )
}
