import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Duruduygu Lab: small electronic products and made-to-measure clothing, designed in Istanbul and built with Claude.",
}

type Spec = { label: string; value: string }
type Product = {
  name: string
  status: string
  description: string
  specs: Spec[]
  image?: { src: string; alt: string; width: number; height: number }
  drawing?: "charm" | "pattern"
}

const products: Product[] = [
  {
    name: "SLAB-100",
    status: "Boards ready for fabrication",
    description:
      "A pocket music player, DJ controller and sampler. One processor handles real-time audio and the other runs the controls, so the sound never stutters when you turn a knob.",
    specs: [
      { label: "Processors", value: "ESP32-S3 for audio, RP2040 for the interface" },
      { label: "Audio", value: "Two PCM5102A DACs, headphone amplifier, built-in microphone" },
      { label: "Controls", value: "40 mm magnetic jog wheel, 20 keys, 96-LED level spine" },
      { label: "Boards", value: "Five two-layer boards" },
      { label: "Power", value: "2000 mAh Li-ion, USB-C charging" },
    ],
    image: {
      src: "/lab/slab-100-iso.svg",
      alt: "SLAB-100 isometric view: a slim dark enclosure with the screen on the front and the LED spine along one edge.",
      width: 700,
      height: 1065,
    },
  },
  {
    name: "CHARM",
    status: "Driver board in design",
    description:
      "A colour e-ink badge for your bag. Tap your phone to change the picture, let it switch images by time of day, and find the bag again from an Android phone.",
    specs: [
      { label: "Display", value: "3\" e-ink in black, white, red and yellow" },
      { label: "Brain", value: "nRF52840 with Bluetooth LE and NFC" },
      { label: "Features", value: "Find-me, NFC image swap, battery level and low-battery alert" },
      { label: "Size", value: "About 92 × 46 mm" },
      { label: "With Claude", value: "Planned: turn any photo into a four-colour image the panel can show" },
    ],
    drawing: "charm",
  },
  {
    name: "Made-to-measure denim",
    status: "First pattern finished",
    description:
      "Trousers cut from your own measurements. Each pattern is parametric: change one number and every seam, notch and pocket follows.",
    specs: [
      { label: "First piece", value: "Wide raw-denim trouser, 12–14 oz fabric" },
      { label: "Pattern tool", value: "Seamly2D parametric patterns" },
      { label: "With Claude", value: "Planned: turn your measurements and style notes into a fitted pattern and cutting plan" },
    ],
    drawing: "pattern",
  },
]

type NowItem = { title: string; text: string; status: string }
const nowUpdated = "8 October 2026"
const now: { area: string; items: NowItem[] }[] = [
  {
    area: "Hardware",
    items: [
      { title: "SLAB-100", status: "Final review", text: "Five boards done in KiCad. Next: local fabrication and a staged first power-on with measurements in a university lab." },
      { title: "CHARM e-ink driver", status: "Designing", text: "My own driver board for a 3\" four-colour e-ink panel on an nRF52840, so the badge doesn't depend on an off-the-shelf HAT." },
      { title: "RSVP reader", status: "Researching", text: "Reviving a salvaged MP5 player board (Rockchip RK2728B) as a one-word-at-a-time speed-reading device. Fallback: an ESP32-S3 bar display." },
      { title: "Pocket multitool", status: "Next", text: "A learning device for my own gear: ESP32 touchscreen with 433 MHz radio, NFC and IR. A modular STM32WB55 version comes later." },
    ],
  },
  {
    area: "Research",
    items: [
      { title: "Biomedical imaging", status: "Ongoing", text: "Biomedical research at İTÜ." },
      { title: "Microplastics in drinking water", status: "Literature review", text: "Reviewing membrane filtration and sampling methods with İTÜ's environmental engineering researchers." },
      { title: "Optimisation study", status: "Ongoing", text: "An engineering optimisation project with an İTÜ faculty member." },
    ],
  },
  {
    area: "Software & design",
    items: [
      { title: "Silk Road", status: "In development", text: "A Unity driving game from Vienna to Xi'an in 1999, ten stages in a camper van where every repair is a choice." },
      { title: "Made-to-measure denim", status: "First pattern done", text: "Parametric trouser patterns in Seamly2D." },
      { title: "This site", status: "Moving", text: "Moving duruduygu.com to a self-hosted server, with a blog and project logs." },
    ],
  },
]

const tags = ["SLAB-100", "CHARM", "E-ink", "ESP32-S3", "nRF52840", "KiCad", "RSVP", "Denim", "Seamly2D", "Silk Road", "Firmware", "PCB"]

const steps = [
  { title: "Draw", text: "Schematics, enclosure drawings and garment patterns, with every part checked against its datasheet." },
  { title: "Review", text: "Claude checks pin mappings, voltage levels and power paths that a design-rule check can't see." },
  { title: "Test", text: "Firmware and test scripts are written and run before a single board is ordered." },
  { title: "Document", text: "Every decision goes into a design log, so the next revision starts from what we learned." },
]

function CharmDrawing() {
  return (
    <svg viewBox="0 0 460 300" className="w-full h-auto" role="img" aria-label="CHARM badge, about 92 by 46 millimetres, with a four-colour e-ink panel.">
      <rect x="70" y="60" width="300" height="160" className="fill-secondary stroke-foreground" strokeWidth="2" />
      <circle cx="96" cy="140" r="9" className="fill-background stroke-foreground" strokeWidth="2" />
      <rect x="122" y="76" width="232" height="128" fill="#ffffff" className="stroke-foreground" strokeWidth="2" />
      <circle cx="300" cy="116" r="20" fill="#E9C33B" />
      <path d="M124 202 L176 150 L214 184 L258 138 L352 202 Z" fill="#1c1917" />
      <path d="M124 202 L176 170 L232 202 Z" fill="#C8102E" />
      <g className="stroke-muted-foreground" strokeWidth="1.5">
        <line x1="70" y1="248" x2="370" y2="248" />
        <line x1="70" y1="240" x2="70" y2="256" />
        <line x1="370" y1="240" x2="370" y2="256" />
        <line x1="398" y1="60" x2="398" y2="220" />
        <line x1="390" y1="60" x2="406" y2="60" />
        <line x1="390" y1="220" x2="406" y2="220" />
      </g>
      <text x="220" y="276" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="17">92 mm</text>
      <text x="428" y="145" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="17">46</text>
    </svg>
  )
}

function PatternDrawing() {
  return (
    <svg viewBox="0 0 460 340" className="w-full h-auto" role="img" aria-label="Trouser front pattern piece with seam allowance, grain line and notches.">
      <path d="M150 40 L290 40 L300 92 Q302 112 318 128 L336 300 L262 300 L230 150 L198 300 L124 300 L140 120 Z" className="fill-secondary stroke-foreground" strokeWidth="2" strokeLinejoin="round" />
      <path d="M140 28 L300 28 L312 90 Q314 108 330 124 L349 312 L254 312 L230 186 L206 312 L111 312 L128 118 Z" fill="none" className="stroke-muted-foreground" strokeWidth="1.2" strokeDasharray="6 5" strokeLinejoin="round" />
      <line x1="176" y1="70" x2="176" y2="262" className="stroke-foreground" strokeWidth="1.5" />
      <path d="M169 82 L176 66 L183 82 Z M169 250 L176 266 L183 250 Z" className="fill-foreground" />
      <line x1="146" y1="182" x2="160" y2="182" className="stroke-foreground" strokeWidth="2" />
      <line x1="300" y1="182" x2="314" y2="182" className="stroke-foreground" strokeWidth="2" />
      <text x="220" y="18" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="17">waist</text>
      <text x="258" y="250" className="fill-muted-foreground font-mono" fontSize="17">inseam</text>
    </svg>
  )
}

export default function LabPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-24 lg:pt-32">
        {/* Intro */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <div className="max-w-3xl space-y-6">
            <span className="font-mono text-sm tracking-wider text-accent uppercase">Lab</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
              Duruduygu Lab
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Small electronic objects and made-to-measure clothes, designed in Istanbul. Every board and
              pattern is drawn here and reviewed with Claude before anything is made. These are prototypes;
              nothing is for sale yet.
            </p>
          </div>
        </section>

        {/* Marquee */}
        <div className="border-y border-border overflow-hidden py-4 bg-secondary/30">
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {[...tags, ...tags].map((tag, index) => (
              <span key={index} className="font-mono text-sm tracking-wider text-muted-foreground uppercase flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Products */}
        <section>
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            {products.map((product) => (
              <article
                key={product.name}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 py-16 lg:py-24 border-b border-border last:border-0"
              >
                <div
                  className={
                    product.image
                      ? "bg-[#191c20] border border-border flex items-center justify-center p-6 lg:p-10"
                      : "bg-secondary/40 border border-border flex items-center justify-center p-6 lg:p-10"
                  }
                >
                  {product.image ? (
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      width={product.image.width}
                      height={product.image.height}
                      className="w-auto h-auto max-h-[560px]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : product.drawing === "charm" ? (
                    <CharmDrawing />
                  ) : (
                    <PatternDrawing />
                  )}
                </div>

                <div className="space-y-6 min-w-0">
                  <div className="space-y-3">
                    <span className="font-mono text-sm text-accent">{product.status}</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-foreground">{product.name}</h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                  <dl className="border-t border-border">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="flex gap-6 py-3 border-b border-border">
                        <dt className="w-24 sm:w-32 shrink-0 font-mono text-sm text-muted-foreground pt-0.5">{spec.label}</dt>
                        <dd className="text-foreground min-w-0">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Now */}
        <section id="now" className="border-t border-border py-16 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-sm tracking-wider text-accent uppercase">On the bench</span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">What&apos;s in progress</h2>
              </div>
              <span className="font-mono text-sm text-muted-foreground">Updated {nowUpdated}</span>
            </div>
            <div className="space-y-12">
              {now.map((group) => (
                <div key={group.area} className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4 lg:gap-12">
                  <h3 className="font-mono text-sm text-muted-foreground pt-1">{group.area}</h3>
                  <ul className="border-t border-border">
                    {group.items.map((item) => (
                      <li
                        key={item.title}
                        className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)_160px] gap-1 md:gap-8 py-4 border-b border-border"
                      >
                        <span className="font-serif text-lg text-foreground">{item.title}</span>
                        <span className="text-muted-foreground leading-relaxed min-w-0">{item.text}</span>
                        <span className="font-mono text-sm text-accent md:text-right">{item.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How we build */}
        <section className="bg-secondary/30 py-16 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-12 max-w-3xl">
              <span className="font-mono text-sm tracking-wider text-accent uppercase">Process</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">How we build with Claude</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                On SLAB-100, Claude&apos;s review found 13 design errors before fabrication, from a DAC pinout
                entered wrong to a slide switch that would have carried the whole system&apos;s current. Twelve are
                fixed on the boards; the thirteenth, a firmware address, gets corrected before first power-on.
              </p>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <li key={step.title} className="border-t border-border pt-6">
                  <span className="font-mono text-2xl text-accent">{index + 1}</span>
                  <h3 className="font-serif text-xl text-foreground mt-3 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">Work with the lab</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              For collaborations, early units or a made-to-measure fitting, write to{" "}
              <a href="mailto:emir@duruduygu.com" className="text-foreground link-underline">
                emir@duruduygu.com
              </a>
              .
            </p>
            <Link href="/contact" className="group inline-flex items-center gap-3 text-foreground font-medium text-lg">
              <span className="relative">
                Get in touch
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
              </span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
