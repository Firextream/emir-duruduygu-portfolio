import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Award, Download } from "lucide-react"

const experiences = [
	{
		title: "Senior Architectural Photographer",
		company: "Studio Perspective",
		location: "New York, NY",
		period: "2022 - Present",
		description:
			"Leading architectural photography projects for high-profile commercial and residential developments.",
	},
	{
		title: "Visual Content Creator",
		company: "Design Quarterly",
		location: "San Francisco, CA",
		period: "2020 - 2022",
		description:
			"Created compelling visual narratives for architectural publications and digital platforms.",
	},
]

const skills = [
	"Architectural Photography",
	"Digital Post-Processing",
	"Drone Photography",
	"3D Visualization",
	"Adobe Creative Suite",
	"Capture One Pro",
]

const achievements = [
	"International Photography Awards - Architecture Winner 2023",
	"Featured in Architectural Digest, Dezeen, ArchDaily",
	"Solo Exhibition: 'Concrete Dreams' at Modern Gallery NYC",
]

export function ResumePreview() {
	return (
		<section className="py-32 px-4 bg-muted/30 relative">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-golden-xl">
					<h2 className="font-heading font-bold text-4xl md:text-5xl mb-golden text-foreground animate-fade-in">
						Professional Journey
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
						A decade of experience capturing architectural narratives and building
						visual stories
					</p>
				</div>

				<div className="grid-asymmetric gap-space-golden-lg mb-golden-xl">
					{/* Experience */}
					<div className="lg:col-span-2">
						<Card className="h-full relative overflow-hidden group hover:-translate-y-2 transition-all duration-700">
							<div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<CardHeader className="relative z-10">
								<CardTitle className="font-heading text-2xl flex items-center space-golden-sm">
									<Calendar className="h-5 w-5 text-accent" />
									Experience
								</CardTitle>
							</CardHeader>
							<CardContent className="space-golden relative z-10">
								{experiences.map((exp, index) => (
									<div
										key={index}
										className="border-l-2 border-accent pl-6 relative group/timeline hover:pl-8 transition-all duration-300"
									>
										<div className="absolute w-3 h-3 bg-accent rounded-full -left-2 top-1 group-hover/timeline:scale-125 transition-transform duration-300"></div>
										<div className="absolute -left-1 top-3 w-1 h-16 bg-accent/20 group-hover/timeline:bg-accent/40 transition-colors duration-300"></div>
										<h3 className="font-heading font-semibold text-lg text-foreground mb-golden-sm">
											{exp.title}
										</h3>
										<p className="text-accent font-medium mb-golden-sm">
											{exp.company}
										</p>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-golden-sm">
											<span className="flex items-center gap-1">
												<MapPin className="h-3 w-3" />
												{exp.location}
											</span>
											<span>{exp.period}</span>
										</div>
										<p className="text-muted-foreground leading-relaxed">
											{exp.description}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Skills & Achievements */}
					<div className="space-golden">
						<Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
							<CardHeader>
								<CardTitle className="font-heading text-xl">
									Core Skills
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap space-golden-sm">
									{skills.map((skill, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 hover:scale-105 transition-all duration-200 cursor-default"
										>
											{skill}
										</span>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
							<CardHeader>
								<CardTitle className="font-heading text-xl flex items-center space-golden-sm">
									<Award className="h-5 w-5 text-accent" />
									Recognition
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-golden-sm">
									{achievements.map((achievement, index) => (
										<li
											key={index}
											className="text-sm text-muted-foreground leading-relaxed hover:text-foreground hover:pl-2 transition-all duration-200"
										>
											• {achievement}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="text-center space-golden">
					<div className="flex flex-col sm:flex-row space-golden justify-center">
						<Button
							asChild
							size="lg"
							variant="outline"
							className="group relative overflow-hidden"
						>
							<Link href="/resume">
								<span className="relative z-10">View Full Resume</span>
								<div className="absolute inset-0 bg-accent/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
							</Link>
						</Button>
						<Button
							size="lg"
							className="bg-accent hover:bg-accent/90 group relative overflow-hidden"
						>
							<Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
							<span className="relative z-10">Download PDF</span>
							<div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
