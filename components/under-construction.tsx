// Site-wide notice while the new version of duruduygu.com is being built.
export function UnderConstruction() {
  return (
    <div
      role="status"
      className="fixed left-1/2 -translate-x-1/2 bottom-14 z-[60] pointer-events-none max-w-[calc(100vw-2rem)]"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-foreground/15 bg-foreground text-background shadow-lg px-4 py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] whitespace-nowrap">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span>Under construction</span>
        <span className="hidden sm:inline opacity-60">· a new version is on the way</span>
      </div>
    </div>
  )
}
