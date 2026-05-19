import { ERAS } from '@/data/eras'
import { yearToPixel } from '@/lib/yearToPixel'
import { yearToDisplay } from '@/lib/yearToDisplay'
import { NOISE_SVG_URI } from '@/lib/noiseConstants'

interface Props {
  locale: 'fr' | 'en'
}

export default function BackgroundLayer({ locale }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {ERAS.map((era) => {
        const left = yearToPixel(era.yearStart)
        const width = yearToPixel(era.yearEnd) - left

        return (
          <div
            key={era.id}
            className="absolute top-0 bottom-0 flex flex-col justify-end pb-8"
            style={{
              left,
              width,
              backgroundImage: `${NOISE_SVG_URI}, linear-gradient(135deg, ${era.gradient[0]}22, ${era.gradient[1]}44)`,
              backgroundBlendMode: 'overlay',
              backgroundSize: '200px 200px, 100% 100%',
              borderRight: `1px solid ${era.gradient[1]}33`,
            }}
          >
            <div
              className="px-3 py-1 mx-3 rounded text-xs font-serif font-bold tracking-wider uppercase opacity-60 truncate"
              style={{ color: era.gradient[1] }}
            >
              {era.name[locale]}
            </div>
            <div
              className="px-3 text-xs opacity-30 truncate"
              style={{ color: era.gradient[1] }}
            >
              {yearToDisplay(era.yearStart, locale)} – {yearToDisplay(era.yearEnd, locale)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
