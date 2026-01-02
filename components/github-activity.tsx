"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GitCommit, GitFork, Star, Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface GitHubRepo {
  name: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  updatedAt: string
}

interface GitHubEvent {
  type: string
  repo: string
  message: string
  createdAt: string
}

interface GitHubActivityProps {
  username: string
  className?: string
  variant?: "repos" | "activity" | "combined"
}

// Language colors
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
}

export function GitHubActivity({ 
  username, 
  className, 
  variant = "repos" 
}: GitHubActivityProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        // Fetch public repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        )
        
        if (reposRes.ok) {
          const reposData = await reposRes.json()
          setRepos(reposData.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            updatedAt: repo.updated_at,
          })))
        }

        // Fetch recent events
        const eventsRes = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=10`
        )
        
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          const formattedEvents = eventsData
            .filter((e: any) => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(e.type))
            .slice(0, 5)
            .map((event: any) => ({
              type: event.type,
              repo: event.repo.name.split('/')[1],
              message: getEventMessage(event),
              createdAt: event.created_at,
            }))
          setEvents(formattedEvents)
        }
      } catch (err) {
        setError('Failed to load GitHub data')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHub()
  }, [username])

  if (loading) {
    return (
      <div className={cn("animate-pulse space-y-3", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-muted-foreground text-sm", className)}>
        {error}
      </div>
    )
  }

  if (variant === "activity") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Github className="w-5 h-5" />
          <span className="font-medium">Recent Activity</span>
        </div>
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
          >
            <GitCommit className="w-4 h-4 mt-1 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{event.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {event.repo} · {formatTimeAgo(event.createdAt)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Repos variant (default)
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          <span className="font-medium">Latest Projects</span>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      
      {repos.map((repo, index) => (
        <motion.a
          key={repo.name}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="block p-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-foreground group-hover:text-accent transition-colors truncate">
                {repo.name}
              </h4>
              {repo.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" />
                {repo.forks}
              </span>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  )
}

function getEventMessage(event: any): string {
  switch (event.type) {
    case 'PushEvent':
      const commits = event.payload.commits || []
      if (commits.length > 0) {
        return commits[0].message
      }
      return 'Pushed commits'
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} ${event.payload.ref || ''}`
    case 'PullRequestEvent':
      return `${event.payload.action} pull request`
    default:
      return event.type
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
