"use client"

import React, { forwardRef } from 'react'
import { useScrollAnimation, useParallax, useMagneticHover } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: boolean
  parallax?: boolean
  parallaxSpeed?: number
  magnetic?: boolean
  magneticStrength?: number
  triggerOnce?: boolean
  style?: React.CSSProperties
}

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({
  children,
  className,
  delay = 0,
  duration = 800,
  distance = 30,
  direction = 'up',
  scale = false,
  parallax = false,
  parallaxSpeed = 0.3,
  magnetic = false,
  magneticStrength = 0.2,
  triggerOnce = true,
  style,
  ...props
}, ref) => {
  const { isVisible, elementRef: scrollRef } = useScrollAnimation({ triggerOnce })
  const { offset, elementRef: parallaxRef } = useParallax(parallaxSpeed)
  const { transform, elementRef: magneticRef } = useMagneticHover(magneticStrength)

  // Combine refs
  const combinedRef = (node: HTMLDivElement) => {
    if (ref) {
      if (typeof ref === 'function') ref(node)
      else ref.current = node
    }
    scrollRef.current = node
    if (parallax) parallaxRef.current = node
    if (magnetic) magneticRef.current = node
  }

  const getTransformStyle = () => {
    let transforms = []
    
    if (!isVisible) {
      // Initial state transforms
      if (direction === 'up') transforms.push(`translateY(${distance}px)`)
      if (direction === 'down') transforms.push(`translateY(-${distance}px)`)
      if (direction === 'left') transforms.push(`translateX(${distance}px)`)
      if (direction === 'right') transforms.push(`translateX(-${distance}px)`)
      if (scale) transforms.push('scale(0.95)')
    }

    // Parallax transform
    if (parallax) {
      transforms.push(`translateY(${offset}px)`)
    }

    // Magnetic transform
    if (magnetic) {
      transforms.push(`translate(${transform.x}px, ${transform.y}px)`)
    }

    return transforms.length > 0 ? transforms.join(' ') : 'none'
  }

  return (
    <div
      ref={combinedRef}
      className={cn(
        'transition-all ease-out animate-on-scroll',
        isVisible && 'in-view',
        magnetic && 'magnetic-hover',
        className
      )}
      style={{
        '--duration': `${duration}ms`,
        '--delay': `${delay}ms`,
        transform: getTransformStyle(),
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
})

ScrollReveal.displayName = 'ScrollReveal'

interface StaggeredRevealProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  baseDelay?: number
}

export const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal
          key={index}
          delay={baseDelay + (index * staggerDelay)}
          className="animate-on-scroll"
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}

export default ScrollReveal
