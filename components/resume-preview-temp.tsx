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
		<section className="py-32 px-6 max-w-7xl mx-auto relative">
			<div className="text-center mb-16">
				<h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 animate-fade-in">
					Professional Journey
				</h2>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
					A decade of experience capturing architectural narratives and building
					visual stories
				</p>
			</div>

			<div className="grid-asymmetric gap-8 mb-16">
				{/* Experience */}
				<div className="lg:col-span-2">
					<Card className="h-full relative overflow-hidden group hover:-translate-y-2 transition-all duration-700">
						<div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<CardHeader className="relative z-10">
							<CardTitle className="font-heading text-2xl flex items-center gap-4">
								<Calendar className="h-5 w-5 text-accent" />
								Experience
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-8 relative z-10">
							{experiences.map((exp, index) => (
								<div
									key={index}
									className="relative pl-6 border-l-2 border-accent/20 hover:border-accent/40 transition-colors duration-300"
								>
									<div className="absolute -left-2 top-0 w-4 h-4 bg-accent rounded-full shadow-lg"></div>
									<h3 className="font-heading font-semibold text-lg text-foreground mb-2">
										{exp.title}
									</h3>
									<p className="text-accent font-medium mb-2">
										{exp.company} • {exp.location}
									</p>
									<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
										<MapPin className="h-4 w-4" />
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
				<div className="space-y-8">
					{/* Skills */}
					<Card className="group hover:-translate-y-2 transition-all duration-700">
						<CardHeader>
							<CardTitle className="font-heading text-xl">Skills</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-3">
								{skills.map((skill, index) => (
									<span
										key={index}
										className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20 hover:bg-accent/20 transition-colors cursor-default"
									>
										{skill}
									</span>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Achievements */}
					<Card className="group hover:-translate-y-2 transition-all duration-700">
						<CardHeader>
							<CardTitle className="font-heading text-xl flex items-center gap-4">
								<Award className="h-5 w-5 text-accent" />
								Recognition
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								{achievements.map((achievement, index) => (
									<li
										key={index}
										className="flex items-start space-x-3 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
									>
										<div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
										<span className="leading-relaxed">{achievement}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="text-center space-y-8">
				<div className="flex flex-col sm:flex-row gap-6 justify-center">
					<Button
						asChild
						size="lg"
						variant="outline"
						className="group border-accent/30 hover:border-accent hover:bg-accent/10"
					>
						<Link href="/resume" className="inline-flex items-center">
							<span className="relative z-10">View Full Resume</span>
							<div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors duration-300 rounded-md"></div>
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
		</section>
	)
}
