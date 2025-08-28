"use client"

import { useState, useMemo, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader, FilterTabs } from "@/components/unified-design-system";
import { getAssetPath } from "@/lib/image-utils";

interface Post {
  id: string
  title: string
  slug: string
  date?: string | null
  excerpt?: string
  readTime?: string
  content?: string
  category?: string
  author?: string
  authorTitle?: string
  image?: string | null
  featured?: boolean
}

export default function BlogClient({ posts }: { posts: (Post | null)[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState<number>(0);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  // Filter out null posts
  const validPosts = posts.filter((post): post is Post => post !== null);

  const categories = ["All", ...new Set(validPosts.map((p) => p.category || "Uncategorized"))];

  // Get featured posts
  const featuredPosts = validPosts.filter(post => post.featured === true).slice(0, 5); // Allow up to 5 featured posts

  // Auto-rotate featured posts
  useEffect(() => {
    if (featuredPosts.length > 1) {
      autoRotateRef.current = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000); // Auto-rotate every 5 seconds

      return () => {
        if (autoRotateRef.current) {
          clearInterval(autoRotateRef.current);
        }
      };
    }
  }, [featuredPosts.length]);

  // Manual navigation functions
  const goToPrevious = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
    // Restart auto-rotation after manual navigation
    if (featuredPosts.length > 1) {
      autoRotateRef.current = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
    }
  };

  const goToNext = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
    // Restart auto-rotation after manual navigation
    if (featuredPosts.length > 1) {
      autoRotateRef.current = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
    }
  };

  const goToSlide = (index: number) => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    setCurrentFeaturedIndex(index);
    // Restart auto-rotation after manual navigation
    if (featuredPosts.length > 1) {
      autoRotateRef.current = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
    }
  };

  const filteredPosts = useMemo(() => {
    const filtered = validPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      // Sort by date (newest first)
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
    return filtered;
  }, [searchQuery, selectedCategory, validPosts]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-golden-xl">
            <SectionHeader
              title="Blog"
              subtitle="Thoughts on architecture, photography, and the intersection of design and technology."
              className="animate-fade-in"
            />
          </div>

          {/* Featured Posts Carousel */}
          {featuredPosts.length > 0 && (
            <div className="mb-golden-xl -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="px-4 sm:px-6 lg:px-8 mb-golden">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground animate-fade-in">
                  Featured Articles
                </h2>
              </div>
              <div className="relative group">
                {/* Main Carousel */}
                <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-none sm:rounded-2xl">
                  {featuredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentFeaturedIndex 
                          ? 'opacity-100 transform translate-x-0' 
                          : index < currentFeaturedIndex 
                            ? 'opacity-0 transform -translate-x-full' 
                            : 'opacity-0 transform translate-x-full'
                      }`}
                    >
                      <Link href={`/blog/${post.slug}`} className="block h-full">
                        <div className="relative h-full group/slide cursor-pointer">
                          <Image
                            src={post.image ? getAssetPath(post.image) : getAssetPath("/placeholder.svg")}
                            alt={post.title}
                            fill
                            className="object-cover group-hover/slide:scale-105 transition-transform duration-1000"
                            priority={index === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                          
                          {/* Content Overlay with improved positioning */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16 text-white">
                            <div className="max-w-5xl mx-auto space-golden">
                              <div className="flex items-center space-golden-sm mb-golden">
                                <Badge variant="secondary" className="bg-accent text-accent-foreground px-4 py-1.5 text-sm font-medium">
                                  Featured
                                </Badge>
                                <Badge variant="outline" className="border-white/40 text-white px-4 py-1.5 text-sm">
                                  {post.category || "Uncategorized"}
                                </Badge>
                              </div>
                              
                              <h3 className="font-heading text-xl md:text-3xl lg:text-5xl font-bold mb-golden line-clamp-2 leading-tight">
                                {post.title}
                              </h3>
                              
                              <p className="text-white/90 text-base md:text-lg lg:text-xl mb-golden line-clamp-2 max-w-3xl leading-relaxed">
                                {post.excerpt || "No excerpt available."}
                              </p>
                              
                              <div className="flex items-center space-golden text-white/80 mb-golden">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                                  <time dateTime={post.date || undefined} className="text-sm lg:text-base">
                                    {post.date
                                      ? new Date(post.date).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "No date"}
                                  </time>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                                  <span className="text-sm lg:text-base">{post.readTime || "N/A"}</span>
                                </div>
                              </div>
                              
                              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 group-hover/slide:gap-4">
                                <span className="text-sm lg:text-base">Read Article</span>
                                <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 group-hover/slide:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons with improved positioning */}
                {featuredPosts.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="float-top-left bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-md h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="float-top-right bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-md h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Dots Indicator with better positioning */}
                {featuredPosts.length > 1 && (
                  <div className="position-center-x bottom-8 flex space-golden-sm">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        className={`transition-all duration-300 rounded-full hover:scale-110 ${
                          index === currentFeaturedIndex 
                            ? 'w-10 h-3 bg-white' 
                            : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                        }`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                {featuredPosts.length > 1 && (
                  <div className="absolute top-6 left-6 right-6">
                    <div className="flex space-golden-sm">
                      {featuredPosts.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full bg-white transition-all duration-300 rounded-full ${
                              index === currentFeaturedIndex ? 'w-full' : 'w-0'
                            }`}
                            style={{
                              animation: index === currentFeaturedIndex ? 'progress 5s linear' : 'none'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search and Filter - Modern Portfolio Style */}
          <div className="mb-golden-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-golden mb-golden">
              <FilterTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                activeColor="accent"
              />

              <div className="flex space-golden items-center">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 w-72 font-light tracking-wide bg-card/50 border-border/30 backdrop-blur-sm focus:bg-card/80 focus:border-accent/30 transition-all duration-300 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* All Posts Section */}
          <div className="mb-golden">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
              All Articles
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore all our articles and find what interests you most.
            </p>
          </div>

          {/* Blog Grid with modern framing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card
                  className={`group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md hover:from-card/80 hover:to-card/60 shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700 hover:-translate-y-3 rounded-2xl h-full ring-1 ring-border/20`}
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    transform: 'translateY(20px)',
                    animation: `slideUp 0.8s ease-out ${index * 150}ms forwards`
                  }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-background/5 to-background/15 rounded-2xl">
                    <Image
                      src={post.image ? getAssetPath(post.image) : getAssetPath("/placeholder.svg")}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-700 rounded-2xl" />
                    
                    {/* Modern floating frame */}
                    <div className="absolute inset-2 border border-white/10 group-hover:border-white/20 transition-all duration-700 rounded-xl pointer-events-none" />
                    
                    {/* Modern floating badges */}
                    <div className="absolute top-6 left-6 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <Badge variant="secondary" className="backdrop-blur-xl bg-white/15 text-white border border-white/20 font-light tracking-wider shadow-2xl hover:bg-white/25 transition-all duration-300 rounded-full px-4 py-1">
                        {post.category || "Uncategorized"}
                      </Badge>
                    </div>
                    {post.featured && (
                      <div className="absolute top-6 right-6 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        <Badge variant="default" className="backdrop-blur-xl bg-accent/20 text-accent border border-accent/30 font-light tracking-wider shadow-2xl hover:bg-accent/30 transition-all duration-300 rounded-full px-4 py-1">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1 bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-md rounded-b-2xl">
                    <CardHeader className="p-0 mb-6">
                      <div className="relative">
                        {/* Modern title frame */}
                        <div className="absolute -left-4 top-1 w-1 h-8 bg-gradient-to-b from-accent/60 to-accent/20 rounded-full" />
                        <CardTitle className="font-heading font-light text-xl text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight tracking-wide pl-2">
                          {post.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-muted-foreground line-clamp-3 text-base leading-relaxed mt-4 font-light bg-card/30 p-4 rounded-lg border border-border/20">
                        {post.excerpt || "No excerpt available."}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-light">
                          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full border border-border/30">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.date || undefined}>
                              {post.date
                                ? new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "No date"}
                            </time>
                          </div>
                          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full border border-border/30">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime || "N/A"}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-accent text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                          <span className="mr-2">Read</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-24 space-golden">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-golden" />
              <h3 className="font-heading font-light text-2xl text-foreground mb-golden-sm">No articles found</h3>
              <p className="text-muted-foreground font-light text-lg max-w-md mx-auto mb-golden">
                Try adjusting your search terms or selecting a different category to discover more work.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
