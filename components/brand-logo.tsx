"use client"

import Link from "next/link"
import Image from "next/image"

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="group relative inline-flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
    >
      {/* Logo Image */}
      <Image
        src="/icon-192.jpg"
        alt="Duruduygu Logo"
        width={36}
        height={36}
        className="w-9 h-9"
        priority
      />
      
      {/* Text */}
      <span className="font-heading font-light text-xl tracking-wide text-foreground hidden sm:inline-block">
        Duruduygu
      </span>
    </Link>
  )
}
