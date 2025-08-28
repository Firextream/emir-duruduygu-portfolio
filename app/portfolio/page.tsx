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
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
								: "space-y-8"
						} animate-in fade-in duration-1000`}
					>
						{filteredItems.map((item, index) => (
							<Dialog key={item.id}>
								<DialogTrigger asChild>
									<Card
										className={`group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md hover:from-card/80 hover:to-card/60 shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700 hover:-translate-y-3 rounded-2xl ${
											item.featured ? 'ring-1 ring-accent/40 shadow-xl shadow-accent/10' : 'ring-1 ring-border/20'
										}`}
										style={{ 
											animationDelay: `${index * 150}ms`,
											transform: 'translateY(20px)',
											animation: `slideUp 0.8s ease-out ${index * 150}ms forwards`
										}}
									>
										{viewMode === "grid" ? (
											<div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-background/5 to-background/15 rounded-2xl">
												<Image
													src={item.image || getAssetPath("/placeholder.svg")}
													alt={item.title}
													fill
													className="object-cover group-hover:scale-110 transition-all duration-1200 ease-out rounded-2xl"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-700 rounded-2xl" />
												<div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 group-hover:to-black/60 transition-all duration-700 rounded-2xl" />
												
												{/* Modern floating frame */}
												<div className="absolute inset-2 border border-white/10 group-hover:border-white/20 transition-all duration-700 rounded-xl pointer-events-none" />
												
												{/* Floating badge with modern frame */}
												<div className="absolute top-6 left-6 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
													<Badge
														variant="secondary"
														className="backdrop-blur-xl bg-white/15 text-white border border-white/20 font-light tracking-wider shadow-2xl hover:bg-white/25 transition-all duration-300 rounded-full px-4 py-1"
													>
														{item.category}
													</Badge>
												</div>

												{/* Content overlay with modern framing */}
												<div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 space-y-4">
													<div className="relative">
														{/* Modern title frame */}
														<div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-accent/60 to-accent/20 group-hover:from-accent/80 group-hover:to-accent/40 transition-all duration-500 rounded-full" />
														<h3 className="font-heading font-light text-white text-xl mb-3 tracking-wide transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500 delay-100 pl-4">
															{item.title}
														</h3>
													</div>
													<div className="flex items-center justify-between transform translate-x-6 group-hover:translate-x-0 transition-transform duration-700 delay-200">
														<p className="text-white/90 text-sm font-light tracking-wide bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
															{item.location}
														</p>
														<p className="text-white/70 text-sm font-light bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
															{item.year}
														</p>
													</div>
													<div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-white/0 via-accent/60 to-white/0 transition-all duration-1000 delay-300"></div>
												</div>

												{/* Modern hover indicator */}
												<div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
													<div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all duration-300 shadow-lg">
														<ArrowUpRight className="w-5 h-5 text-white" />
													</div>
												</div>
											</div>
										) : (
											<div className="flex gap-8 p-8 bg-gradient-to-r from-card/70 to-card/50 backdrop-blur-md border border-border/20 rounded-2xl">
												<div className="w-56 h-36 relative overflow-hidden flex-shrink-0 rounded-xl ring-1 ring-border/30 shadow-lg">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
													/>
													<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/30 transition-all duration-500 rounded-xl" />
													{/* Modern image frame */}
													<div className="absolute inset-1 border border-white/10 group-hover:border-white/20 transition-all duration-500 rounded-lg pointer-events-none" />
												</div>
												<div className="flex-1 space-y-4 py-2">
													<div className="flex items-center gap-4">
														<Badge variant="secondary" className="font-light tracking-wide bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1">{item.category}</Badge>
														<span className="text-sm text-muted-foreground font-light bg-muted/50 px-3 py-1 rounded-full border border-border/30">{item.year}</span>
													</div>
													<div className="relative">
														<div className="absolute -left-4 top-1 w-1 h-8 bg-gradient-to-b from-accent/60 to-accent/20 rounded-full" />
														<h3 className="font-heading font-light text-2xl text-foreground tracking-wide">{item.title}</h3>
													</div>
													<p className="text-muted-foreground font-light bg-muted/30 inline-block px-3 py-1 rounded-full border border-border/30">{item.location}</p>
													<p className="text-foreground/80 leading-relaxed font-light line-clamp-2 bg-card/30 p-4 rounded-lg border border-border/20">{item.description}</p>
												</div>
											</div>
										)}
									</Card>
								</DialogTrigger>
								<DialogContent className="max-w-6xl animate-in fade-in zoom-in duration-700 border border-border/20 bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6">
										<div className="aspect-[4/3] relative overflow-hidden rounded-2xl ring-1 ring-border/30 shadow-xl">
											<Image
												src={item.image || getAssetPath("/placeholder.svg")}
												alt={item.title}
												fill
												className="object-cover rounded-2xl"
												sizes="(max-width: 1200px) 100vw, 50vw"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
											{/* Modern dialog image frame */}
											<div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none" />
										</div>
										<div className="space-y-8 py-6">
											<div className="space-y-6">
												<Badge variant="secondary" className="font-light tracking-wider px-6 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full">
													{item.category}
												</Badge>
												<div className="relative">
													<div className="absolute -left-6 top-2 w-1 h-12 bg-gradient-to-b from-accent/60 to-accent/20 rounded-full" />
													<h2 className="font-heading font-light text-4xl text-foreground tracking-wide leading-tight">
														{item.title}
													</h2>
												</div>
												<div className="flex items-center gap-6 text-muted-foreground font-light">
													<span className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border border-border/30">
														<MapPin className="w-4 h-4" />
														{item.location}
													</span>
													<span className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full border border-border/30">
														<Calendar className="w-4 h-4" />
														{item.year}
													</span>
												</div>
											</div>
											<div className="w-full h-px bg-gradient-to-r from-border/0 via-accent/30 to-border/0"></div>
											<p className="text-foreground/90 leading-relaxed text-lg font-light tracking-wide bg-card/30 p-6 rounded-xl border border-border/20">{item.description}</p>
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
