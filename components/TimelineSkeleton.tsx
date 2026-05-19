import { ERAS } from '@/data/eras'
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel'

export default function TimelineSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement de la frise… / Loading timeline…"
      className="animate-pulse absolute inset-0 overflow-hidden"
      style={{ width: TOTAL_WIDTH }}
    >
      {ERAS.map((era) => (
        <div
          key={era.id}
          className="absolute top-0 bottom-0 bg-stone-800 border-r border-stone-700"
          style={{
            left: yearToPixel(era.yearStart),
            width: yearToPixel(era.yearEnd) - yearToPixel(era.yearStart),
          }}
        />
      ))}
      <div
        className="absolute h-px bg-stone-700"
        style={{ top: 48, left: 0, right: 0 }}
      />
      <span className="sr-only">Chargement de la frise… / Loading timeline…</span>
    </div>
  )
}
