"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Filter, Grid, List, Search } from "lucide-react"
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
								? "grid-experimental gap-space-fluid-lg"
								: "space-golden"
						}`}
					>
						{filteredItems.map((item, index) => (
							<Dialog key={item.id}>
								<DialogTrigger asChild>
									<Card
										className={`group cursor-pointer overflow-hidden border-border/50 bg-card hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 animate-on-scroll hover:border-border masonry-item magnetic-hover layer-content ${
											item.featured ? 'featured breathe-slow' : ''
										} ${index % 4 === 0 ? 'experimental drift-moderate' : ''} ${index % 6 === 0 ? 'offset-subtle' : ''} ${index % 8 === 0 ? 'float-gentle' : ''}`}
										style={{ animationDelay: `${index * 200}ms` }}
									>
										{viewMode === "grid" ? (
											<div className="aspect-[4/3] relative overflow-hidden layer-base">
												<Image
													src={item.image || getAssetPath("/placeholder.svg")}
													alt={item.title}
													fill
													className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
												<div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 layer-overlay" />
												<div className="absolute bottom-6 left-6 right-6 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 space-golden-sm layer-content">
													<Badge
														variant="secondary"
														className="mb-3 backdrop-blur-md bg-white/20 text-white border-white/20 font-light tracking-wide shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
													>
														{item.category}
													</Badge>
													<h3 className="font-heading font-light text-white text-xl mb-2 tracking-wide transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
														{item.title}
													</h3>
													<p className="text-white/70 text-sm font-light tracking-wide transform translate-x-8 group-hover:translate-x-0 transition-transform duration-700">
														{item.location} • {item.year}
													</p>
												</div>
											</div>
										) : (
											<div className="flex space-golden p-6">
												<div className="w-48 h-32 relative overflow-hidden flex-shrink-0">
													<Image
														src={item.image || getAssetPath("/placeholder.svg")}
														alt={item.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-300"
													/>
												</div>
												<div className="flex-1 space-golden-sm">
													<div className="flex items-center space-golden-sm">
														<Badge variant="secondary">{item.category}</Badge>
														<span className="text-sm text-muted-foreground">{item.year}</span>
													</div>
													<h3 className="font-heading font-semibold text-xl text-foreground">{item.title}</h3>
													<p className="text-muted-foreground">{item.location}</p>
													<p className="text-foreground leading-relaxed line-clamp-2">{item.description}</p>
												</div>
											</div>
										)}
									</Card>
								</DialogTrigger>
								<DialogContent className="max-w-5xl animate-in fade-in zoom-in duration-500 border-border/50">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
										<div className="aspect-[4/3] relative overflow-hidden">
											<Image
												src={item.image || getAssetPath("/placeholder.svg")}
												alt={item.title}
												fill
												className="object-cover"
												sizes="(max-width: 1200px) 100vw, 50vw"
											/>
										</div>
										<div className="space-y-6 py-4">
											<div>
												<Badge variant="secondary" className="mb-4 font-light tracking-wide">
													{item.category}
												</Badge>
												<h2 className="font-heading font-light text-3xl text-foreground mb-2 tracking-wide">
													{item.title}
												</h2>
												<p className="text-muted-foreground font-light tracking-wide">
													{item.location} • {item.year}
												</p>
											</div>
											<p className="text-foreground leading-relaxed text-lg font-light">{item.description}</p>
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
