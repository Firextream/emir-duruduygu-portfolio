import { Button } from "@/components/ui/button"

interface FilterTabsProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  activeColor?: "green" | "primary" | "accent"
}

export function FilterTabs({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  activeColor = "green" 
}: FilterTabsProps) {
  const getActiveClasses = () => {
    switch (activeColor) {
      case "green":
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 backdrop-blur-sm shadow-lg shadow-accent/10"
      case "primary":
        return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 backdrop-blur-sm shadow-lg shadow-primary/10"
      case "accent":
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 backdrop-blur-sm shadow-lg shadow-accent/10"
      default:
        return "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 backdrop-blur-sm shadow-lg shadow-accent/10"
    }
  }

  const getInactiveClasses = () => {
    return "bg-card/50 text-muted-foreground border-border/30 hover:bg-card/80 hover:text-foreground hover:border-border/50 backdrop-blur-sm transition-all duration-300"
  }

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`
            px-5 py-2 font-light text-sm tracking-wide transition-all duration-500 border-0 rounded-full
            ${selectedCategory === category 
              ? getActiveClasses() 
              : getInactiveClasses()
            }
          `}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle: string
  alignment?: "left" | "center"
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  alignment = "left",
  className = "" 
}: SectionHeaderProps) {
  const alignmentClasses = alignment === "center" 
    ? "text-center items-center" 
    : "text-left items-start"

  return (
    <div className={`flex flex-col ${alignmentClasses} space-y-4 ${className}`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}
