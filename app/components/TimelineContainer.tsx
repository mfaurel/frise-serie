import { shows } from "@/data/shows";
import { eras } from "@/data/eras";
import { buildDensityZones } from "@/lib/density";
import { yearToPixel } from "@/lib/yearToPixel";
import { VIRTUAL_CANVAS_WIDTH } from "@/lib/constants";

export default function TimelineContainer() {
  const zones = buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH);
  const totalWidth = zones[zones.length - 1].pixelEnd;

  return (
    <div data-testid="timeline-scroll" className="overflow-x-auto w-full" style={{ height: 80 }}>
      <div
        data-testid="timeline-inner"
        style={{ width: totalWidth, position: "relative", height: "100%" }}
      >
        {eras.map((era) => {
          const px = yearToPixel(era.yearStart, zones);
          const label =
            era.yearStart < 0
              ? Math.abs(era.yearStart) + " BC"
              : era.yearStart + " AD";
          return (
            <span
              key={era.id}
              data-testid="year-label"
              style={{ position: "absolute", left: px, top: 4 }}
              className="text-xs text-white/70 select-none"
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
