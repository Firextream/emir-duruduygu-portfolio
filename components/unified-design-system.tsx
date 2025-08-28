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
        return "bg-green-600 text-white border-green-600 hover:bg-green-700 architectural-shadow"
      case "primary":
        return "bg-primary text-primary-foreground border-primary architectural-shadow"
      case "accent":
        return "bg-accent text-accent-foreground border-accent architectural-shadow"
      default:
        return "bg-green-600 text-white border-green-600 hover:bg-green-700 architectural-shadow"
    }
  }

  const getInactiveClasses = () => {
    return "bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:architectural-shadow"
  }

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`
            px-6 py-2 font-medium text-sm transition-all duration-200 border
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
