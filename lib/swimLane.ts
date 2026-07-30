import type { DensityZone, Show } from "@/types";
import { yearToPixel } from "@/lib/yearToPixel";

export const CARD_WIDTH = 88;
export const CARD_HEIGHT = 180;
export const CARD_GAP = 16;
export const BASE_TOP = 120;
export const LANE_HEIGHT = CARD_HEIGHT + CARD_GAP; // 196

export interface LaidOutShow {
  show: Show;
  left: number;
  lane: number;
  top: number;
}

export function computeSwimLaneLayout(
  shows: Show[],
  zones: DensityZone[],
): LaidOutShow[] {
  const withLeft = shows.map((show) => ({
    show,
    left: yearToPixel(show.narrativeYearStart, zones),
  }));

  withLeft.sort((a, b) => a.left - b.left);

  const laneEnds: number[] = [];
  return withLeft.map(({ show, left }) => {
    const cardLeft = left - CARD_WIDTH / 2;
    let lane = laneEnds.findIndex((end) => cardLeft >= end);
    if (lane === -1) {
      lane = laneEnds.length;
    }
    laneEnds[lane] = left + CARD_WIDTH / 2;
    return {
      show,
      left,
      lane,
      top: BASE_TOP + lane * LANE_HEIGHT,
    };
  });
}
