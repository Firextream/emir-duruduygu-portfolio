"use client"

import { useEffect, useMemo, useRef, useState } from "react"

interface TypewriterProps {
  words: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export function Typewriter({ 
  words, 
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const longestWord = useMemo(() => {
    return words.reduce((longest, word) => {
      return word.length > longest.length ? word : longest
    }, "")
  }, [words])

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    
    const type = () => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
          timeoutRef.current = setTimeout(type, typingSpeed)
        } else {
          // Pause before deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true)
            type()
          }, pauseTime)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
          timeoutRef.current = setTimeout(type, deletingSpeed)
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }

    timeoutRef.current = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className={`relative inline-grid align-top ${className}`}>
      {/* Reserve the maximum word footprint so typing does not resize surrounding layout */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {longestWord}
        <span>|</span>
      </span>
      <span className="col-start-1 row-start-1">
        {currentText}
        <span className="animate-pulse text-accent">|</span>
      </span>
    </span>
  )
}
