"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Filter, Grid, List, Search, ArrowUpRight, MapPin, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { SectionHeader, FilterTabs } from "@/components/unified-design-system"
import { getAssetPath } from "@/lib/image-utils"

const portfolioItems = [
	{
		id: 1,
		title: "Urban Geometries",
		category: "Architecture",
		location: "Tokyo, Japan",
		year: "2024",
		image: getAssetPath("/modern-geometric-building-tokyo-architecture.png"),
		description:
			"A study of geometric forms in contemporary Japanese architecture, exploring the interplay between traditional minimalism and modern urban design.",
		featured: true,
	},
	{
		id: 2,
		title: "Concrete Dreams",
		category: "Photography",
		location: "Berlin, Germany",
		year: "2023",
		image: getAssetPath("/brutalist-concrete-architecture-berlin-dramatic-li.png"),
		description: "Capturing the raw beauty of brutalist architecture through dramatic lighting and bold compositions.",
		featured: false,
	},
	{
		id: 3,
		title: "Light Studies",
		category: "Photography",
		location: "Barcelona, Spain",
		year: "2023",
		image: getAssetPath("/architectural-photography-natural-light-barcelona-.png"),
		description: "An exploration of how natural light transforms architectural spaces throughout the day.",
		featured: true,
	},
	{
		id: 4,
		title: "Minimalist Spaces",
		category: "Interior",
		location: "Copenhagen, Denmark",
		year: "2024",
		image: getAssetPath("/minimalist-interior-design-copenhagen-clean-lines.png"),
		description: "Documenting the essence of Scandinavian minimalism in contemporary interior spaces.",
		featured: false,
	},
	{
		id: 5,
		title: "Industrial Heritage",
		category: "Architecture",
		location: "Manchester, UK",
		year: "2023",
		image: getAssetPath("/industrial-architecture-manchester-converted-wareh.png"),
		description: "The transformation of industrial heritage buildings into modern architectural marvels.",
		featured: false,
	},
	{
		id: 6,
		title: "Shadow Play",
		category: "Photography",
		location: "Los Angeles, USA",
		year: "2024",
		image: getAssetPath("/architectural-shadows-los-angeles-modern-building-.png"),
		description: "Exploring the dramatic interplay of shadows and geometric forms in contemporary architecture.",
		featured: true,
	},
]

const categories = ["All", "Architecture", "Photography", "Interior"]

export default function PortfolioPage() {
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const [searchTerm, setSearchTerm] = useState("")
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		setIsLoaded(true)
	}, [])

	const filteredItems = portfolioItems.filter((item) => {
		const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
		const matchesSearch =
			searchTerm === "" ||
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase())
		return matchesCategory && matchesSearch
	})

	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-8 sm:mb-12 lg:mb-16">
						<div
							className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<div className="text-xs sm:text-sm font-light tracking-[0.2em] text-muted-foreground uppercase mb-4 sm:mb-6">
								Selected Works
							</div>
							<SectionHeader
								title="Portfolio"
								subtitle="A curated collection of architectural photography and design explorations from around the world, capturing the intersection of light, form, and space in contemporary architecture."
							/>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
						<div className="w-full lg:w-auto">
							<FilterTabs
								categories={categories}
								selectedCategory={selectedCategory}
								onCategoryChange={setSelectedCategory}
							/>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full lg:w-auto">
							<div className="relative w-full sm:w-80">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
								<Input
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-12 w-full font-light tracking-wide bg-transparent border-0 border-b border-border/20 focus:border-accent/40 transition-all duration-300 rounded-none shadow-none focus:shadow-none"
								/>
							</div>

							<div className="flex gap-2 flex-shrink-0">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className={`transition-all duration-300 p-2 sm:p-3 ${
										viewMode === "grid" 
											? "text-accent border-b-2 border-accent bg-transparent hover:bg-accent/5" 
											: "text-muted-foreground hover:text-foreground bg-transparent"
									} rounded-none border-0 shadow-none`}
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className={`transition-all duration-300 p-2 sm:p-3 ${
										viewMode === "list" 
											? "text-accent border-b-2 border-accent bg-transparent hover:bg-accent/5" 
											: "text-muted-foreground hover:text-foreground bg-transparent"
									} rounded-none border-0 shadow-none`}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div
						className={`${
							viewMode === "grid"
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
								: "space-y-6"
						} animate-in fade-in duration-1000`}
					>
						{filteredItems.map((item, index) => (
							<Dialog key={item.id}>
								<DialogTrigger asChild>
									<Card
										className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:bg-card/5 transition-all duration-500 hover:-translate-y-1"
										style={{ 
											animationDelay: `${index * 100}ms`,
											transform: 'translateY(20px)',
											animation: `slideUp 0.6s ease-out ${index * 100}ms forwards`
										}}
									>
										{viewMode === "grid" ? (
											<div className="space-y-3 sm:space-y-4">
												<div className="aspect-[4/3] relative overflow-hidden rounded-lg">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
														sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
													/>
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
													
													{/* Simple category badge */}
													<div className="absolute top-2 left-2 sm:top-3 sm:left-3">
														<span className="bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded text-xs font-medium">
															{item.category}
														</span>
													</div>
												</div>

												{/* Content below image */}
												<div className="space-y-2 pt-1 sm:pt-2 px-1">
													<h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2">
														{item.title}
													</h3>
													<div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
														<span className="truncate pr-2">{item.location}</span>
														<span className="flex-shrink-0">{item.year}</span>
													</div>
													<p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
														{item.description}
													</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 border-b border-border/10 last:border-b-0">
												<div className="w-full sm:w-48 h-48 sm:h-32 relative overflow-hidden flex-shrink-0 rounded-lg">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
												</div>
												<div className="flex-1 space-y-2 sm:space-y-3">
													<div className="flex flex-wrap items-center gap-2 sm:gap-3">
														<span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">{item.category}</span>
														<span className="text-xs text-muted-foreground">{item.year}</span>
													</div>
													<h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2">{item.title}</h3>
													<p className="text-muted-foreground text-xs sm:text-sm">{item.location}</p>
													<p className="text-foreground/80 leading-relaxed text-sm line-clamp-3 sm:line-clamp-3">{item.description}</p>
												</div>
											</div>
										)}
									</Card>
								</DialogTrigger>
								<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] bg-white border-0">
									<div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
										{/* Header */}
										<div className="space-y-3 sm:space-y-4">
											<div className="flex flex-wrap items-center gap-2 sm:gap-3">
												<span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">{item.category}</span>
												<span className="text-sm text-gray-600">{item.year}</span>
											</div>
											<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{item.title}</h1>
											<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 text-sm">
												<span className="flex items-center gap-2">
													<MapPin className="w-4 h-4" />
													{item.location}
												</span>
												<span className="flex items-center gap-2">
													<Calendar className="w-4 h-4" />
													{item.year}
												</span>
											</div>
										</div>

										{/* Main Image */}
										<div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-lg">
											<Image
												src={item.image || getAssetPath("/placeholder.svg")}
												alt={item.title}
												fill
												className="object-cover"
												sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 80vw"
											/>
										</div>

										{/* Article Content */}
										<div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
											<div className="space-y-4 sm:space-y-6">
												<div className="text-base sm:text-lg text-gray-800 leading-relaxed">
													{item.description}
												</div>
												
												<div className="space-y-3 sm:space-y-4">
													<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Project Overview</h2>
													<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
														This architectural project represents a thoughtful exploration of {item.category.toLowerCase()} design principles, 
														showcasing how contemporary architecture can harmoniously blend functionality with aesthetic appeal. 
														Located in {item.location}, this project exemplifies the cutting-edge design trends that defined {item.year}.
													</p>
												</div>

												<div className="space-y-3 sm:space-y-4">
													<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Design Philosophy</h2>
													<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
														The design approach emphasizes clean lines, sustainable materials, and innovative spatial relationships. 
														Every element has been carefully considered to create a cohesive architectural narrative that speaks to both 
														the immediate context and broader urban fabric.
													</p>
												</div>

												<div className="space-y-3 sm:space-y-4">
													<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Technical Details</h2>
													<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
														<div className="space-y-2">
															<h3 className="font-semibold text-gray-900 text-base sm:text-lg">Project Information</h3>
															<div className="space-y-1 text-xs sm:text-sm text-gray-600">
																<div><span className="font-medium">Category:</span> {item.category}</div>
																<div><span className="font-medium">Location:</span> {item.location}</div>
																<div><span className="font-medium">Year:</span> {item.year}</div>
																<div><span className="font-medium">Status:</span> Completed</div>
															</div>
														</div>
														<div className="space-y-2">
															<h3 className="font-semibold text-gray-900 text-base sm:text-lg">Key Features</h3>
															<ul className="space-y-1 text-xs sm:text-sm text-gray-600">
																<li>• Sustainable design principles</li>
																<li>• Natural light optimization</li>
																<li>• Modern material palette</li>
																<li>• Contextual integration</li>
															</ul>
														</div>
													</div>
												</div>

												<div className="space-y-3 sm:space-y-4">
													<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Impact & Recognition</h2>
													<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
														This project has contributed to the ongoing dialogue about contemporary {item.category.toLowerCase()} design, 
														demonstrating how thoughtful architecture can enhance both individual experience and community fabric. 
														The project stands as a testament to the power of design to transform spaces and create lasting value.
													</p>
												</div>
											</div>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						))}
					</div>

					{filteredItems.length === 0 && (
						<div className="text-center py-24 space-golden">
							<Filter className="h-16 w-16 text-muted-foreground/50 mx-auto mb-golden" />
							<h3 className="font-heading font-light text-2xl text-foreground mb-golden-sm">No projects found</h3>
							<p className="text-muted-foreground font-light text-lg max-w-md mx-auto">
								Try adjusting your search terms or selecting a different category to discover more work.
							</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	)
}
