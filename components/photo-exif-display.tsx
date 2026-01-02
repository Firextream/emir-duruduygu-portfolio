"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Aperture, Clock, Sun, Ruler, Focus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExifData {
  camera?: string
  lens?: string
  focalLength?: string
  aperture?: string
  shutterSpeed?: string
  iso?: string
  date?: string
  location?: string
}

interface PhotoExifDisplayProps {
  exif: ExifData
  className?: string
  variant?: "inline" | "overlay" | "expandable"
}

export function PhotoExifDisplay({ exif, className, variant = "inline" }: PhotoExifDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const exifItems = [
    { icon: Camera, label: "Camera", value: exif.camera },
    { icon: Focus, label: "Lens", value: exif.lens },
    { icon: Ruler, label: "Focal Length", value: exif.focalLength },
    { icon: Aperture, label: "Aperture", value: exif.aperture },
    { icon: Clock, label: "Shutter", value: exif.shutterSpeed },
    { icon: Sun, label: "ISO", value: exif.iso },
  ].filter(item => item.value)

  if (variant === "overlay") {
    return (
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent",
        className
      )}>
        <div className="flex flex-wrap gap-4 text-white/80 text-sm font-mono">
          {exifItems.slice(0, 4).map((item, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <item.icon className="w-3.5 h-3.5" />
              {item.value}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (variant === "expandable") {
    return (
      <div className={cn("", className)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>EXIF Data</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {exifItems.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </div>
                    <p className="font-mono text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default inline variant
  return (
    <div className={cn(
      "flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground font-mono",
      className
    )}>
      {exifItems.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5" title={item.label}>
          <item.icon className="w-3.5 h-3.5 text-accent" />
          {item.value}
        </span>
      ))}
    </div>
  )
}

// Compact badge-style display
export function ExifBadges({ exif, className }: { exif: ExifData; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {exif.camera && (
        <span className="px-2 py-1 bg-secondary text-xs font-mono rounded-full flex items-center gap-1">
          <Camera className="w-3 h-3" />
          {exif.camera}
        </span>
      )}
      {exif.aperture && (
        <span className="px-2 py-1 bg-secondary text-xs font-mono rounded-full">
          {exif.aperture}
        </span>
      )}
      {exif.shutterSpeed && (
        <span className="px-2 py-1 bg-secondary text-xs font-mono rounded-full">
          {exif.shutterSpeed}
        </span>
      )}
      {exif.iso && (
        <span className="px-2 py-1 bg-secondary text-xs font-mono rounded-full">
          ISO {exif.iso}
        </span>
      )}
      {exif.focalLength && (
        <span className="px-2 py-1 bg-secondary text-xs font-mono rounded-full">
          {exif.focalLength}
        </span>
      )}
    </div>
  )
}

// Full EXIF card
export function ExifCard({ exif, className }: { exif: ExifData; className?: string }) {
  return (
    <div className={cn(
      "p-6 bg-secondary/50 border border-border rounded-xl",
      className
    )}>
      <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
        <Camera className="w-4 h-4 text-accent" />
        Camera Settings
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {exif.camera && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Camera</p>
            <p className="font-mono text-sm">{exif.camera}</p>
          </div>
        )}
        {exif.lens && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Lens</p>
            <p className="font-mono text-sm">{exif.lens}</p>
          </div>
        )}
        {exif.focalLength && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Focal Length</p>
            <p className="font-mono text-sm">{exif.focalLength}</p>
          </div>
        )}
        {exif.aperture && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Aperture</p>
            <p className="font-mono text-sm">{exif.aperture}</p>
          </div>
        )}
        {exif.shutterSpeed && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Shutter Speed</p>
            <p className="font-mono text-sm">{exif.shutterSpeed}</p>
          </div>
        )}
        {exif.iso && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">ISO</p>
            <p className="font-mono text-sm">{exif.iso}</p>
          </div>
        )}
      </div>
      
      {exif.date && (
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          Taken on {new Date(exif.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      )}
    </div>
  )
}
