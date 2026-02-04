export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="font-mono text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
