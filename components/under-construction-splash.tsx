// While the redesign is being built, every page shows only this notice.
export function UnderConstructionSplash() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf8] text-[#1a1a1a] px-6"
    >
      <div className="max-w-xl w-full">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a]/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          duruduygu.com
        </p>
        <h1 className="mt-6 font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight">
          Under
          <br />
          <span className="text-[#3d5a4a]">construction</span>
        </h1>
      </div>
    </div>
  )
}
