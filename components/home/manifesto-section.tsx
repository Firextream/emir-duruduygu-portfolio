export function ManifestoSection() {
  return (
    <section className="py-24 lg:py-40 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
        {/* Decorative Quote Mark */}
        <div className="absolute -top-8 -left-4 lg:-top-16 lg:-left-8">
          <span className="font-serif text-[120px] lg:text-[200px] text-accent/10 leading-none select-none">
            "
          </span>
        </div>
        
        <div className="text-center relative z-10">
          {/* Label */}
          <span className="font-mono text-sm tracking-wider text-accent uppercase mb-8 block">
            Philosophy
          </span>
          
          {/* Quote */}
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-foreground leading-relaxed text-balance">
            Just capturing things that catch my eye.
          </blockquote>
          
          {/* Author */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-border" />
            <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Emir Duruduygu
            </p>
            <span className="w-12 h-px bg-border" />
          </div>
        </div>
        
        {/* Decorative Closing Quote Mark */}
        <div className="absolute -bottom-8 -right-4 lg:-bottom-16 lg:-right-8">
          <span className="font-serif text-[120px] lg:text-[200px] text-accent/10 leading-none select-none rotate-180 inline-block">
            "
          </span>
        </div>
      </div>
    </section>
  )
}
