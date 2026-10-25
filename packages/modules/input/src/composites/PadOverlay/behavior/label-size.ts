/* @layer renderer-components @kind logic */
import { DETAIL_LINE_RATIO, DETAIL_SAMPLES, MIN_UNDERLINE_SAMPLE, NAME_LINE_RATIO, UNDERLINE_GAP } from '../PadOverlay.constants';
import type { OverlayMetrics, OverlaySlotView } from '../PadOverlay.type';
import { faceDirection } from './face-direction';
import type { LabelSize } from './placement.type';

const labelSize = (slot: OverlaySlotView, { measure, fontPx }: OverlayMetrics): LabelSize => {
  const sample = faceDirection(slot) ?? DETAIL_SAMPLES[slot.kind];
  const hasDetail = sample !== '';
  return {
    w: Math.max(measure.name(slot.label), hasDetail ? measure.detail(sample) : 0, measure.name(MIN_UNDERLINE_SAMPLE)),
    up: UNDERLINE_GAP + fontPx * NAME_LINE_RATIO,
    down: UNDERLINE_GAP + (hasDetail ? fontPx * DETAIL_LINE_RATIO : 0),
  };
};

export { labelSize };
