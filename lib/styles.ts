import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation utilities
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up", 
  scaleIn: "animate-scale-in",
  textReveal: "animate-text-reveal",
  lineDraw: "animate-line-draw",
  onScroll: "animate-on-scroll",
  drift: {
    slight: "drift-slight",
    moderate: "drift-moderate",
  },
  float: "float-gentle",
  breathe: "breathe",
  breatheSlow: "breathe-slow",
  rotate: "rotate-subtle",
  magnetic: "magnetic-hover",
} as const

// Positioning utilities
export const positioning = {
  center: "position-center",
  centerX: "position-center-x", 
  centerY: "position-center-y",
  float: {
    topLeft: "float-top-left",
    topRight: "float-top-right",
    bottomLeft: "float-bottom-left",
    bottomRight: "float-bottom-right",
  },
  offset: {
    slight: "offset-slight",
    subtle: "offset-subtle", 
    moderate: "offset-moderate",
    strong: "offset-strong",
  },
  offsetX: {
    slight: "offset-x-slight",
    subtle: "offset-x-subtle",
    moderate: "offset-x-moderate", 
    strong: "offset-x-strong",
  },
  offsetY: {
    slight: "offset-y-slight",
    subtle: "offset-y-subtle",
    moderate: "offset-y-moderate",
    strong: "offset-y-strong", 
  },
} as const

// Grid utilities
export const grids = {
  modernist: "grid-modernist",
  asymmetric: "grid-asymmetric",
  bauhaus: "grid-bauhaus",
  experimental: "grid-experimental",
  scattered: "grid-scattered",
  masonry: "masonry-grid",
} as const

// Spacing utilities
export const spacing = {
  golden: {
    sm: "space-golden-sm",
    base: "space-golden",
    lg: "space-golden-lg", 
    xl: "space-golden-xl",
  },
  fluid: {
    sm: "space-fluid-sm",
    base: "space-fluid",
    lg: "space-fluid-lg",
    xl: "space-fluid-xl",
  },
  gap: {
    golden: {
      sm: "gap-space-golden-sm",
      base: "gap-space-golden",
      lg: "gap-space-golden-lg",
      xl: "gap-space-golden-xl",
    },
    fluid: {
      sm: "gap-space-fluid-sm", 
      base: "gap-space-fluid",
      lg: "gap-space-fluid-lg",
      xl: "gap-space-fluid-xl",
    },
  },
  margin: {
    golden: {
      topSm: "mt-golden-sm",
      top: "mt-golden",
      topLg: "mt-golden-lg",
      topXl: "mt-golden-xl",
      bottomSm: "mb-golden-sm",
      bottom: "mb-golden", 
      bottomLg: "mb-golden-lg",
      bottomXl: "mb-golden-xl",
    },
  },
} as const

// Layer utilities
export const layers = {
  base: "layer-base",
  content: "layer-content", 
  interactive: "layer-interactive",
  overlay: "layer-overlay",
  modal: "layer-modal",
  tooltip: "layer-tooltip",
} as const

// Viewport utilities
export const viewport = {
  height: {
    quarter: "h-quarter",
    third: "h-third", 
    half: "h-half",
    twoThirds: "h-two-thirds",
    threeQuarters: "h-three-quarters",
  },
  width: {
    quarter: "w-quarter",
    third: "w-third",
    half: "w-half", 
    twoThirds: "w-two-thirds",
    threeQuarters: "w-three-quarters",
  },
} as const

// Alignment utilities
export const alignment = {
  bauhaus: "align-bauhaus",
  swiss: "align-swiss",
  minimal: "align-minimal",
} as const

// Stagger utilities
export const stagger = {
  1: "stagger-1",
  2: "stagger-2",
  3: "stagger-3",
  4: "stagger-4", 
  5: "stagger-5",
} as const

// Parallax utilities
export const parallax = {
  container: "parallax-container",
  element: "parallax-element",
  back: "parallax-back",
  mid: "parallax-mid",
  front: "parallax-front",
} as const

// Masonry utilities
export const masonry = {
  grid: "masonry-grid",
  item: "masonry-item",
  featured: "masonry-item featured",
  offset: "masonry-item offset",
  experimental: "masonry-item experimental",
} as const

// Helper function to combine utilities
export function createAnimatedClass(
  baseClass: string,
  animationType?: string,
  delay?: number
): string {
  const classes = [baseClass]
  
  if (animationType) {
    classes.push(animationType)
  }
  
  if (delay !== undefined) {
    classes.push(`delay-${delay}`)
  }
  
  return cn(...classes)
}

// Helper function for masonry items
export function createMasonryItemClass(
  index: number,
  featured = false,
  experimental = false
): string {
  const classes = ["masonry-item"]
  
  if (featured) classes.push("featured", "breathe-slow")
  if (experimental || index % 4 === 0) classes.push("experimental", "drift-moderate")
  if (index % 6 === 0) classes.push("offset-subtle")
  if (index % 8 === 0) classes.push("float-gentle")
  
  classes.push("magnetic-hover", "layer-content", "animate-on-scroll")
  
  return cn(...classes)
}

// Helper function for grid items
export function createGridItemClass(
  index: number,
  animationType: 'gallery' | 'portfolio' | 'blog' = 'gallery'
): string {
  const classes = ["group", "cursor-pointer", "transition-all", "duration-700"]
  
  // Animation variations based on type
  switch (animationType) {
    case 'gallery':
      classes.push("hover:scale-105", "hover:-translate-y-2")
      break
    case 'portfolio': 
      classes.push("hover:shadow-2xl", "hover:-translate-y-3")
      break
    case 'blog':
      classes.push("hover:shadow-xl", "hover:-translate-y-3")
      break
  }
  
  // Add experimental positioning
  if (index % 3 === 0) classes.push("drift-slight")
  if (index % 5 === 0) classes.push("breathe-slow")
  
  classes.push("magnetic-hover", "layer-content", "animate-on-scroll")
  
  return cn(...classes)
}
