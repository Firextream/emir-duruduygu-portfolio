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
			<main className="pt-24 pb-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-golden-xl">
						<div
							className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
						>
							<div className="text-sm font-light tracking-[0.2em] text-muted-foreground uppercase mb-golden">
								Selected Works
							</div>
							<SectionHeader
								title="Portfolio"
								subtitle="A curated collection of architectural photography and design explorations from around the world, capturing the intersection of light, form, and space in contemporary architecture."
							/>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-golden mb-golden">
						<FilterTabs
							categories={categories}
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
						/>

						<div className="flex space-golden items-center">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
								<Input
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-12 w-72 font-light tracking-wide bg-card/50 border-border/30 backdrop-blur-sm focus:bg-card/80 focus:border-accent/30 transition-all duration-300 rounded-full"
								/>
							</div>

							<div className="flex gap-1 bg-card/30 backdrop-blur-sm rounded-full p-1 border border-border/20">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className={`rounded-full transition-all duration-300 ${
										viewMode === "grid" 
											? "bg-accent/20 text-accent hover:bg-accent/30 shadow-lg shadow-accent/10" 
											: "text-muted-foreground hover:text-foreground hover:bg-card/50"
									}`}
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className={`rounded-full transition-all duration-300 ${
										viewMode === "list" 
											? "bg-accent/20 text-accent hover:bg-accent/30 shadow-lg shadow-accent/10" 
											: "text-muted-foreground hover:text-foreground hover:bg-card/50"
									}`}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div
						className={`${
							viewMode === "grid"
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
								: "space-y-12"
						} animate-in fade-in duration-1000`}
					>
						{filteredItems.map((item, index) => (
							<Dialog key={item.id}>
								<DialogTrigger asChild>
									<Card
										className={`group cursor-pointer overflow-hidden border-0 bg-transparent hover:bg-card/10 transition-all duration-700 hover:-translate-y-2 ${
											item.featured ? 'opacity-100' : 'opacity-100'
										}`}
										style={{ 
											animationDelay: `${index * 150}ms`,
											transform: 'translateY(20px)',
											animation: `slideUp 0.8s ease-out ${index * 150}ms forwards`
										}}
									>
										{viewMode === "grid" ? (
											<div className="aspect-[4/3] relative overflow-hidden rounded-lg group">
												<Image
													src={item.image || getAssetPath("/placeholder.svg")}
													alt={item.title}
													fill
													className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
												
												{/* Simple category badge */}
												<div className="absolute top-4 left-4">
													<span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium">
														{item.category}
													</span>
												</div>

												{/* Clean content overlay */}
												<div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
													<h3 className="text-xl font-semibold mb-2 text-white">
														{item.title}
													</h3>
													<div className="flex justify-between items-center text-sm text-white/80">
														<span>{item.location}</span>
														<span>{item.year}</span>
													</div>
												</div>

												{/* Simple hover indicator */}
												<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<ArrowUpRight className="w-5 h-5 text-white" />
												</div>
											</div>
										) : (
											<div className="flex gap-6 p-6">
												<div className="w-48 h-32 relative overflow-hidden flex-shrink-0 rounded-lg">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
												</div>
												<div className="flex-1 space-y-3">
													<div className="flex items-center gap-3">
														<span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">{item.category}</span>
														<span className="text-sm text-muted-foreground">{item.year}</span>
													</div>
													<h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
													<p className="text-muted-foreground text-sm">{item.location}</p>
													<p className="text-foreground/80 leading-relaxed">{item.description}</p>
												</div>
											</div>
										)}
									</Card>
								</DialogTrigger>
								<DialogContent className="max-w-5xl">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										<div className="aspect-[4/3] relative overflow-hidden rounded-lg">
											<Image
												src={item.image || getAssetPath("/placeholder.svg")}
												alt={item.title}
												fill
												className="object-cover"
												sizes="(max-width: 1200px) 100vw, 50vw"
											/>
										</div>
										<div className="space-y-6">
											<div className="space-y-4">
												<span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
													{item.category}
												</span>
												<h2 className="text-3xl font-bold text-foreground">
													{item.title}
												</h2>
												<div className="flex items-center gap-4 text-muted-foreground">
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
											<p className="text-foreground/80 leading-relaxed">{item.description}</p>
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
