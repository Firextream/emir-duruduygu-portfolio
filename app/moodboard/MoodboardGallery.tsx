"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useInView,
} from "framer-motion"
import Image from "next/image"
import { X, ArrowUpRight } from "lucide-react"
import { type MoodboardCollection, type MoodboardItem } from "./data"

/* ────────────────────────────────────────────
   HERO SECTION — parallax text on mousemove
──────────────────────────────────────────── */
function HeroSection({ mouseNorm, collectionCount }: { mouseNorm: { x: number; y: number }; collectionCount: number }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const floatingWords = ["FORM", "FUNCTION", "SYSTEM", "GLITCH", "VOID", "NULL", "RENDER"]

  return (
    <motion.div style={{ y, opacity }} className="min-h-[85vh] flex flex-col justify-center relative mb-4 overflow-hidden">

      {/* Parallax ambient words */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        {floatingWords.map((word, i) => (
          <div
            key={word}
            className="absolute font-serif font-black text-foreground/[0.025] uppercase leading-none whitespace-nowrap"
            style={{
              fontSize: `clamp(4rem, ${8 + i * 1.5}vw, 14rem)`,
              left: `${(i * 29 + 2) % 75}%`,
              top: `${(i * 13 + 5) % 80}%`,
              transform: `translate(${(mouseNorm.x - 0.5) * -(i + 1) * 18}px, ${(mouseNorm.y - 0.5) * -(i + 1) * 10}px)`,
              transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Animated scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Main hero text — also parallaxes with mouse */}
      <div
        className="relative z-10"
        style={{
          transform: `translate(${(mouseNorm.x - 0.5) * -8}px, ${(mouseNorm.y - 0.5) * -5}px)`,
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <motion.span
          className="font-mono text-sm tracking-[0.4em] text-accent uppercase block mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Inspiration Directory
        </motion.span>

        <div className="overflow-hidden mb-6">
          <motion.h1
            className="font-serif text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-tighter text-foreground"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            MOOD
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="font-serif text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-tighter text-foreground pl-[8vw]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            BOARD
          </motion.h1>
        </div>

        <motion.p
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl font-light leading-relaxed mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Select a collection. Step inside. Let it reshape how you see.
        </motion.p>
      </div>

      {/* Bottom counter + line */}
      <motion.div
        className="absolute bottom-6 left-0 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {collectionCount} collections
        </span>
        <div className="w-16 h-px bg-border" />
        <span className="font-mono text-xs text-accent animate-pulse">●</span>
      </motion.div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   MAGNETIC 3D CARD — with scroll reveal
──────────────────────────────────────────── */
function MagneticCard({
  collection,
  index,
  onSelect,
}: {
  collection: MoodboardCollection
  index: number
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "-80px" })

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(0.88)
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  const springCfg = { stiffness: 180, damping: 22 }
  const rx = useSpring(rotateX, springCfg)
  const ry = useSpring(rotateY, springCfg)
  const sc = useSpring(scale, { stiffness: 200, damping: 25 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const dx = (e.clientX - rect.left) / rect.width
      const dy = (e.clientY - rect.top) / rect.height
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      rotateX.set(-(((e.clientY - cy) / (rect.height / 2)) * 14))
      rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 14)
      glowX.set(dx * 100)
      glowY.set(dy * 100)
    },
    [rotateX, rotateY, glowX, glowY]
  )

  const handleMouseEnter = () => scale.set(0.95)
  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(0.88)
    glowX.set(50)
    glowY.set(50)
  }

  // Dynamic gradient highlight following cursor (calmer and theme-adaptive)
  const gradientBg = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 60%)`
  )

  return (
    <motion.div
      ref={cardRef}
      data-card
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      layoutId={`card-${collection.id}`}
      initial={{ opacity: 0, y: 80, scale: 0.82 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 0.88 } : { opacity: 0, y: 80, scale: 0.82 }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rx,
        rotateY: ry,
        scale: sc,
        transformStyle: "preserve-3d",
      }}
      className="relative overflow-hidden bg-card border border-border aspect-[3/4] group"
    >
      {/* Mouse-following gradient highlight */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ background: gradientBg }} />

      {/* Cover Image */}
      <div className="absolute inset-0">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      </div>

      {/* Subtle grid lines on the card */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          backgroundImage: "linear-gradient(color-mix(in srgb, var(--accent) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--accent) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Index */}
      <div className="absolute top-5 left-5 z-20">
        <span className="font-mono text-[10px] tracking-[0.35em] text-accent uppercase opacity-60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

{/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6" style={{ transform: "translateZ(30px)" }}>
        <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-2 opacity-70">
          {collection.subtitle}
        </p>
        <h2 className="font-serif text-xl lg:text-2xl text-white leading-tight mb-4 group-hover:text-accent transition-colors duration-500">
          {collection.title}
        </h2>

        {/* Open indicator */}
        <div className="flex items-center gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <div className="h-px flex-1 bg-accent/80" />
          <ArrowUpRight size={12} className="text-accent" />
          <span className="font-mono text-[9px] tracking-widest text-accent uppercase">
            OPEN BOARD
          </span>
        </div>
      </div>

      {/* CRT scanlines on hover (calmer and theme-adaptive) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--accent) 10%, transparent) 2px, color-mix(in srgb, var(--accent) 10%, transparent) 4px)",
        }}
      />
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   DETAIL BOARD — expanded full-screen view
──────────────────────────────────────────── */
function MoodboardDetail({
  collection,
  onClose,
}: {
  collection: MoodboardCollection
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <motion.div
      layoutId={`card-${collection.id}`}
      className="fixed inset-0 z-[200] bg-background overflow-y-auto"
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
    >
      {/* Sticky Close bar */}
      <div className="sticky top-0 z-[210] flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase opacity-70">
            {collection.subtitle}
          </span>
          <div className="w-8 h-px bg-border" />
          <span className="font-serif text-lg text-foreground">{collection.title}</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase border border-border px-4 py-2 hover:border-accent hover:text-accent transition-all duration-200 group"
        >
          <X size={10} className="group-hover:rotate-90 transition-transform duration-300" />
          Close
        </button>
      </div>

      {/* Cover hero */}
      <div className="relative h-[55vh] overflow-hidden">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
        <div className="absolute bottom-10 left-8 right-8">
          <motion.p
            className="font-mono text-xs tracking-[0.4em] text-accent uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {collection.subtitle}
          </motion.p>
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none tracking-tighter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {collection.title}
          </motion.h1>
        </div>
      </div>

      {/* Items grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          {collection.items.map((item, i) => (
            <BoardItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   BOARD ITEM — individual grid card
──────────────────────────────────────────── */
function BoardItem({ item, index }: { item: MoodboardItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  const Wrapper = item.link ? "a" : "div"
  const wrapperProps = item.link
    ? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    : {}

  return (
    <motion.div
      ref={ref}
      className={item.span}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Wrapper
        {...(wrapperProps as any)}
        className="group relative overflow-hidden bg-card border border-border w-full h-full block"
        style={{ transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease" }}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = "6px 6px 0px var(--accent)"
          el.style.transform = "translate(-3px, -3px)"
          el.style.borderColor = "var(--accent)"
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = "none"
          el.style.transform = "translate(0, 0)"
          el.style.borderColor = ""
        }}
      >
        {/* Tag */}
        {item.tag && (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-accent text-accent-foreground text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
              {item.tag}
            </span>
          </div>
        )}

        {item.type === "image" && (
          <div className="absolute inset-0">
            <Image
              src={item.src!}
              alt={item.alt!}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent transition-colors duration-300 z-10 pointer-events-none" />
          </div>
        )}

        {item.type === "color" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 border border-border mb-4 transition-transform group-hover:scale-110 duration-500"
              style={{ backgroundColor: item.hex, boxShadow: `0 0 24px ${item.hex}50` }}
            />
            <span className="font-mono text-xs uppercase tracking-wider">{item.hex}</span>
            <span className="text-[10px] text-muted-foreground mt-1">{item.label}</span>
          </div>
        )}

        {item.type === "quote" && (
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 bg-foreground text-background overflow-hidden">
            {/* Glitch line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-accent/30 group-hover:bg-accent transition-colors duration-300" />
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl leading-tight mb-4 uppercase group-hover:text-accent transition-colors duration-500">
              "{item.text}"
            </blockquote>
            <cite className="font-mono text-[9px] tracking-widest text-muted-foreground not-italic">
              — {item.author}
            </cite>
          </div>
        )}

        {item.type === "typography" && (
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] text-accent uppercase tracking-wider block mb-2">
                Typeface System
              </span>
              <h3 className="font-mono text-xl sm:text-2xl md:text-4xl group-hover:text-accent transition-colors duration-300">
                {item.font}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 font-mono">
              {item.weights?.map((weight, i) => (
                <span
                  key={i}
                  className="text-[9px] sm:text-xs border border-border px-2 py-1 group-hover:border-accent transition-colors duration-300"
                >
                  {weight}
                </span>
              ))}
            </div>
          </div>
        )}
      </Wrapper>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   ROOT GALLERY COMPONENT
──────────────────────────────────────────── */
export function MoodboardGallery({ collections }: { collections?: MoodboardCollection[] }) {
  const moodboardCollections = collections ?? staticCollections
  const [active, setActive] = useState<MoodboardCollection | null>(null)
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseNorm({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
  }, [])

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            {/* Hero with parallax */}
            <HeroSection mouseNorm={mouseNorm} collectionCount={moodboardCollections.length} />

            {/* Section label */}
            <motion.div
              className="flex items-center gap-6 mb-12"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
                {moodboardCollections.length} collections
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase">
                Select to explore
              </span>
            </motion.div>

            {/* Cards — "distant" feel via scale(0.88) + perspective */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-24"
              style={{ perspective: "1400px" }}
            >
              {moodboardCollections.map((col, i) => (
                <MagneticCard
                  key={col.id}
                  collection={col}
                  index={i}
                  onSelect={() => setActive(col)}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Detail overlay */}
      <AnimatePresence>
        {active && (
          <MoodboardDetail
            collection={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
