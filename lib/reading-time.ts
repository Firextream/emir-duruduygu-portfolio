// Calculate reading time for text content
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '')
  
  // Count words
  const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Calculate minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  return Math.max(1, minutes)
}

// Format reading time with translation support
export function formatReadingTime(minutes: number, language: 'tr' | 'en' = 'en'): string {
  if (language === 'tr') {
    return `${minutes} dk okuma`
  }
  return `${minutes} min read`
}
