"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true)
          clearInterval(timer)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  if (isComplete) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="font-heading font-extralight text-4xl tracking-wider text-foreground">Emir Duruduygu</h1>
          <p className="text-muted-foreground font-light tracking-[0.2em] uppercase text-sm">Loading Portfolio</p>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-px bg-border relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-foreground transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground font-light tracking-wider">{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  )
}
