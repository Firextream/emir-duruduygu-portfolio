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
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search projects..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-64 font-light"
								/>
							</div>

							<div className="flex space-golden-sm">
								<Button
									variant={viewMode === "grid" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="transition-all duration-200"
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="transition-all duration-200"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div
						className={`${
							viewMode === "grid"
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
								: "space-y-8"
						} animate-in fade-in duration-1000`}
					>
						{filteredItems.map((item, index) => (
							<Dialog key={item.id}>
								<DialogTrigger asChild>
									<Card
										className={`group cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-700 hover:-translate-y-2 ${
											item.featured ? 'ring-2 ring-accent/30 shadow-lg shadow-accent/5' : ''
										}`}
										style={{ 
											animationDelay: `${index * 150}ms`,
											transform: 'translateY(20px)',
											animation: `slideUp 0.8s ease-out ${index * 150}ms forwards`
										}}
									>
										{viewMode === "grid" ? (
											<div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-background/10 to-background/30">
												<Image
													src={item.image || getAssetPath("/placeholder.svg")}
													alt={item.title}
													fill
													className="object-cover group-hover:scale-110 transition-all duration-1200 ease-out"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700" />
												<div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 group-hover:to-black/50 transition-all duration-700" />
												
												{/* Floating badge */}
												<div className="absolute top-4 left-4 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
													<Badge
														variant="secondary"
														className="backdrop-blur-md bg-white/20 text-white border-white/30 font-light tracking-wider shadow-lg hover:bg-white/30 transition-all duration-300"
													>
														{item.category}
													</Badge>
												</div>

												{/* Content overlay */}
												<div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 space-y-3">
													<h3 className="font-heading font-light text-white text-xl mb-2 tracking-wide transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500 delay-100">
														{item.title}
													</h3>
													<div className="flex items-center justify-between transform translate-x-6 group-hover:translate-x-0 transition-transform duration-700 delay-200">
														<p className="text-white/80 text-sm font-light tracking-wide">
															{item.location}
														</p>
														<p className="text-white/60 text-sm font-light">
															{item.year}
														</p>
													</div>
													<div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-white/0 via-white/50 to-white/0 transition-all duration-1000 delay-300"></div>
												</div>

												{/* Hover indicator */}
												<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
													<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
														<ArrowUpRight className="w-4 h-4 text-white" />
													</div>
												</div>
											</div>
										) : (
											<div className="flex gap-6 p-6 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm">
												<div className="w-48 h-32 relative overflow-hidden flex-shrink-0 rounded-lg">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
													<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/30 transition-all duration-500" />
												</div>
												<div className="flex-1 space-y-3 py-2">
													<div className="flex items-center gap-3">
														<Badge variant="secondary" className="font-light tracking-wide">{item.category}</Badge>
														<span className="text-sm text-muted-foreground font-light">{item.year}</span>
													</div>
													<h3 className="font-heading font-light text-2xl text-foreground tracking-wide">{item.title}</h3>
													<p className="text-muted-foreground font-light">{item.location}</p>
													<p className="text-foreground/80 leading-relaxed font-light line-clamp-2">{item.description}</p>
												</div>
											</div>
										)}
									</Card>
								</DialogTrigger>
								<DialogContent className="max-w-6xl animate-in fade-in zoom-in duration-700 border-border/30 bg-background/95 backdrop-blur-xl">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
										<div className="aspect-[4/3] relative overflow-hidden rounded-lg">
											<Image
												src={item.image || getAssetPath("/placeholder.svg")}
												alt={item.title}
												fill
												className="object-cover"
												sizes="(max-width: 1200px) 100vw, 50vw"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
										</div>
										<div className="space-y-6 py-4">
											<div className="space-y-4">
												<Badge variant="secondary" className="font-light tracking-wider px-4 py-1">
													{item.category}
												</Badge>
												<h2 className="font-heading font-light text-4xl text-foreground tracking-wide leading-tight">
													{item.title}
												</h2>
												<div className="flex items-center gap-4 text-muted-foreground font-light">
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
											<div className="w-full h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0"></div>
											<p className="text-foreground/90 leading-relaxed text-lg font-light tracking-wide">{item.description}</p>
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
