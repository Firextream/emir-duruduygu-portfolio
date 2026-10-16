// Quiet's 9×9 pixel star (filled with the current accent).
const CELLS = '4,0 4,1 3,2 4,2 5,2 0,3 1,3 2,3 3,3 4,3 5,3 6,3 7,3 8,3 1,4 2,4 3,4 4,4 5,4 6,4 7,4 2,5 3,5 4,5 5,5 6,5 2,6 3,6 5,6 6,6 1,7 2,7 6,7 7,7 1,8 7,8'
  .split(' ')
  .map((c) => c.split(',').map(Number))

const PATH = CELLS.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join('')

export default function PixelStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 9" className={className} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d={PATH} />
    </svg>
  )
}
