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
        return "bg-accent/10 text-accent border-0 border-b-2 border-accent hover:bg-accent/15 font-medium"
      case "primary":
        return "bg-primary/10 text-primary border-0 border-b-2 border-primary hover:bg-primary/15 font-medium"
      case "accent":
        return "bg-accent/10 text-accent border-0 border-b-2 border-accent hover:bg-accent/15 font-medium"
      default:
        return "bg-accent/10 text-accent border-0 border-b-2 border-accent hover:bg-accent/15 font-medium"
    }
  }

  const getInactiveClasses = () => {
    return "bg-transparent text-muted-foreground border-0 border-b-2 border-transparent hover:text-foreground hover:border-border/30 transition-all duration-300"
  }

  return (
    <div className="flex flex-wrap gap-3 sm:gap-6 justify-start">
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`
            px-3 sm:px-4 py-2 font-light text-xs sm:text-sm tracking-wide transition-all duration-300 rounded-none whitespace-nowrap
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
