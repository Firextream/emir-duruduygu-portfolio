"use client"

import { AnimatedCounter } from "@/components/animated-counter"

const stats = [
  { value: 500, suffix: "+", label: "Photos Captured" },
  { value: 1, suffix: "", label: "Year Learning" },
  { value: 15, suffix: "", label: "Cities Explored" },
  { value: 1, suffix: "", label: "Curiosity" },
]

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2000 + index * 200}
                />
              </div>
              <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
