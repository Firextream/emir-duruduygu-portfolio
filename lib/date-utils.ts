/**
 * Utility functions for date formatting and manipulation
 */

export function formatDate(dateString: string | null, format: 'full' | 'short' = 'full'): string {
  if (!dateString) return 'No date available'

  try {
    const date = new Date(dateString)
    
    if (format === 'short') {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", 
        day: "numeric",
      })
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.warn('Invalid date format:', dateString)
    return 'Invalid date'
  }
}

export function isValidDate(dateString: string | null): boolean {
  if (!dateString) return false
  
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return "Unknown";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid";
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid";
  }
}

export function getRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Unknown time";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch (error) {
    return "Unknown time";
  }
}
