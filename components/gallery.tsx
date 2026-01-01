"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, Download, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  category?: string
  location?: string
  date?: string
  featured?: boolean
  aspectRatio?: "square" | "portrait" | "landscape"
}

interface GalleryProps {
  images: GalleryImage[]
  columns?: number
  showFilters?: boolean
}

export function Gallery({ images, columns = 4, showFilters = true }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)

  const categories = ["All", ...new Set(images.map(img => img.category).filter(Boolean))]

  const filteredImages = images.filter(image => 
    selectedCategory === "All" || image.category === selectedCategory
  )

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const getGridCols = () => {
    switch (columns) {
      case 2: return "grid-cols-2"
      case 3: return "grid-cols-2 md:grid-cols-3"
      case 4: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      case 5: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      default: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    }
  }

  const getImageHeight = (aspectRatio?: string, index?: number) => {
    if (aspectRatio === "portrait") return "aspect-[3/4]"
    if (aspectRatio === "landscape") return "aspect-[4/3]"
    if (aspectRatio === "square") return "aspect-square"
    
    // Create varied heights for masonry effect
    const heights = ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[5/4]"]
    return heights[(index || 0) % heights.length]
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {showFilters && (
          <div className="flex gap-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-full" />
            ))}
          </div>
        )}
        <div className={`grid ${getGridCols()} gap-4`}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`${getImageHeight("square", i)} bg-muted rounded-lg animate-pulse`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      {showFilters && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category || "All")}
              className="transition-all duration-200 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <motion.div 
        className={`grid-scattered gap-space-fluid-lg`}
        layout
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className={`group relative overflow-hidden rounded-lg bg-muted cursor-pointer ${getImageHeight(image.aspectRatio, index)} magnetic-hover layer-content animate-on-scroll ${
                index % 3 === 0 ? 'drift-slight' : ''
              } ${index % 5 === 0 ? 'breathe-slow' : ''} ${
                image.featured ? 'layer-interactive' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 6}
                loading={index < 6 ? undefined : "lazy"}
              />
              
              {/* Enhanced Overlay with depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/20 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/60 transition-all duration-500 layer-overlay" />
              
              {/* Hover Content with better positioning */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 layer-interactive">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="text-white w-8 h-8" />
                </div>
              </div>

              {/* Category Badge with improved positioning */}
              {image.category && (
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Badge variant="secondary" className="text-xs backdrop-blur-md bg-white/90 text-gray-900 border-0 shadow-lg">
                    {image.category}
                  </Badge>
                </div>
              )}

              {/* Featured Badge with floating animation */}
              {image.featured && (
                <div className="absolute top-3 right-3 float-gentle">
                  <Badge variant="default" className="text-xs bg-accent/90 backdrop-blur-md shadow-lg border-0">
                    Featured
                  </Badge>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Image */}
              <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {selectedImage.title || selectedImage.alt}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      {selectedImage.location && (
                        <span>{selectedImage.location}</span>
                      )}
                      {selectedImage.date && (
                        <span>{selectedImage.date}</span>
                      )}
                      {selectedImage.category && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedImage.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-black/50 border-white/20 text-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-black/50 border-white/20 text-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-black/50 border-white/20 text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-muted-foreground mb-4">
            No images found in this category.
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory("All")}
          >
            View All Images
          </Button>
        </div>
      )}
    </div>
  )
}
