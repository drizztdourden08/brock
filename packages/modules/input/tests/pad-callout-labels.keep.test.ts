/* @layer renderer-components @kind test */
import { describe, expect, it } from 'vitest';
import { calloutSpot } from '../src/composites/PadOverlay/behavior/callout-spot';
import { describePart } from '../src/composites/PadOverlay/behavior/describe-part';
import { labelSize } from '../src/composites/PadOverlay/behavior/label-size';
import type { OverlayMetrics, OverlaySlotView } from '../src/composites/PadOverlay/PadOverlay.type';
import { FAMILY_OVERLAYS } from '../src/pad-overlay/family-overlays.constants';

const CHAR = 7;
const metrics: OverlayMetrics = {
  width: 400,
  height: 300,
  fontPx: 12,
  measure: { name: (text) => text.length * CHAR, detail: (text) => text.length * CHAR },
};

const slotOf = (label: string, anchor: OverlaySlotView['anchor'] = 'shoulder.left'): OverlaySlotView =>
  ({ anchor, kind: 'button', glyph: '', label });

const FACE_DIRECTION_BY_ANCHOR = {
  'face.north': 'Up', 'face.east': 'Right', 'face.south': 'Down', 'face.west': 'Left',
} as const;

describe('callout text alignment', () => {
  const size = { w: 40, up: 16, down: 16 };
  const elbow = { x: 100, y: 50 };

  it('puts the text at the far end of the underline for callouts above or below', () => {
    for (const zone of ['above', 'below'] as const) {
      const toward = calloutSpot(elbow, 1, size, zone);
      expect(toward.anchor).toBe('end');
      expect(toward.nameAt.x).toBeLessThan(toward.tail.x);
      expect(toward.nameAt.x).toBeGreaterThan(elbow.x);
      const away = calloutSpot(elbow, -1, size, zone);
      expect(away.anchor).toBe('start');
      expect(away.nameAt.x).toBeGreaterThan(away.tail.x);
      expect(away.nameAt.x).toBeLessThan(elbow.x);
    }
  });

  it('keeps side callouts reading from the leader', () => {
    expect(calloutSpot(elbow, 1, size, 'right').anchor).toBe('start');
    expect(calloutSpot(elbow, -1, size, 'left').anchor).toBe('end');
    expect(calloutSpot(elbow, 1, size, 'right').nameAt.x).toBeGreaterThan(elbow.x);
  });
});

describe('underline length', () => {
  it('is at least five characters wide for a short label', () => {
    expect(labelSize(slotOf('A'), metrics).w).toBe(5 * CHAR);
    expect(labelSize(slotOf('LB'), metrics).w).toBe(5 * CHAR);
  });

  it('still grows with a long label', () => {
    expect(labelSize(slotOf('Right stick'), metrics).w).toBe('Right stick'.length * CHAR);
  });
});

describe('face button second line', () => {
  const faceOf = (family: keyof typeof FAMILY_OVERLAYS) =>
    FAMILY_OVERLAYS[family].slots.filter((slot) => slot.anchor in FACE_DIRECTION_BY_ANCHOR);

  it('names the direction of the slot in every family', () => {
    for (const family of Object.keys(FAMILY_OVERLAYS) as (keyof typeof FAMILY_OVERLAYS)[]) {
      const faces = faceOf(family);
      expect(faces).toHaveLength(4);
      for (const slot of faces) {
        expect(describePart(slot, undefined)).toBe(FACE_DIRECTION_BY_ANCHOR[slot.anchor as keyof typeof FACE_DIRECTION_BY_ANCHOR]);
      }
    }
  });

  it('follows where the Nintendo button sits, not its letter', () => {
    const byLabel = Object.fromEntries(faceOf('nintendo').map((slot) => [slot.label, describePart(slot, undefined)]));
    expect(byLabel).toEqual({ A: 'Right', B: 'Down', X: 'Up', Y: 'Left' });
  });

  it('leaves other inputs without a second line and gives a face button room for one', () => {
    expect(describePart(slotOf('LB'), undefined)).toBeUndefined();
    expect(labelSize(slotOf('A', 'face.east'), metrics).down).toBeGreaterThan(labelSize(slotOf('LB'), metrics).down);
  });
});
