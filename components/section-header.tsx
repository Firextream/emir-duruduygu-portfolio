import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({ title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", align === "center" && "text-center", className)}>
      <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground text-balance">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>}
    </div>
  )
}
