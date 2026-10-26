/* @layer renderer-components @kind test */
import { CONTROLLER_SILHOUETTE_PATHS } from '@drizztdourden08/tessera/composites';
import { describe, expect, it } from 'vitest';
import { bodyLength } from '../src/composites/PadOverlay/behavior/body-length';
import { calloutSpot } from '../src/composites/PadOverlay/behavior/callout-spot';
import { describePart } from '../src/composites/PadOverlay/behavior/describe-part';
import { labelSize } from '../src/composites/PadOverlay/behavior/label-size';
import { layoutOverlay } from '../src/composites/PadOverlay/behavior/layout-overlay';
import { outlinePoints } from '../src/composites/PadOverlay/behavior/outline-points';
import type { OverlayMetrics, OverlaySlotView, Point } from '../src/composites/PadOverlay/PadOverlay.type';
import { CONTROLLER_SILHOUETTE_ANCHORS } from '../src/controller-anchors';
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

const metricsOf = (width: number, height: number, fontPx: number): OverlayMetrics => ({
  width,
  height,
  fontPx,
  measure: { name: (text) => text.length * fontPx * 0.6, detail: (text) => text.length * fontPx * 0.6 },
});

const LAYOUT_METRICS = metricsOf(640, 420, 13);
const SMALL_WINDOW_METRICS = metricsOf(640, 360, 14);

type Family = keyof typeof FAMILY_OVERLAYS;

const labelOf = (family: Family, anchor: OverlaySlotView['anchor'], layoutMetrics: OverlayMetrics = LAYOUT_METRICS) => {
  const { variant, slots } = FAMILY_OVERLAYS[family];
  const outline = CONTROLLER_SILHOUETTE_PATHS[variant];
  const layout = layoutOverlay(slots.map((slot) => ({ ...slot })), CONTROLLER_SILHOUETTE_ANCHORS[variant], outline, layoutMetrics);
  const { origin, scale } = layout.frame;
  const points = outlinePoints(outline).map((point) => ({ x: origin.x + point.x * scale, y: origin.y + point.y * scale }));
  const edges = points.map((point, index): readonly [Point, Point] => [point, points[(index + 1) % points.length] ?? point]);
  const label = layout.labels.find((placed) => placed.part.slot.anchor === anchor);
  if (!label) throw new Error(`no label for ${anchor}`);
  const segments = label.leader.slice(1).map((point, index): readonly [Point, Point] => [label.leader[index] ?? point, point]);
  return {
    elbowY: label.leader.at(-2)?.y ?? Infinity,
    inside: bodyLength(segments, { outline: points, outlineEdges: edges }),
    top: Math.min(...points.map((point) => point.y)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
};

describe('body length of a leader', () => {
  const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
  const edges = square.map((point, index): readonly [Point, Point] => [point, square[(index + 1) % square.length] ?? point]);
  const body = { outline: square, outlineEdges: edges };

  it('counts only the part of a segment that runs inside the outline', () => {
    expect(bodyLength([[{ x: -5, y: 5 }, { x: 15, y: 5 }]], body)).toBeCloseTo(10);
    expect(bodyLength([[{ x: 5, y: 5 }, { x: 5, y: 25 }]], body)).toBeCloseTo(5);
    expect(bodyLength([[{ x: 20, y: 5 }, { x: 30, y: 5 }]], body)).toBe(0);
  });
});

describe('pad leaders and meta callouts', () => {
  const metaAnchors = ['meta.menu', 'meta.view', 'meta.capture'] as const;

  it('puts Menu and View above an Xbox layout', () => {
    for (const anchor of ['meta.menu', 'meta.view'] as const) {
      const { elbowY, top } = labelOf('xbox', anchor);
      expect(elbowY).toBeLessThan(top);
    }
  });

  it('keeps the Xbox meta leaders from running far through the body', () => {
    for (const anchor of metaAnchors) expect(labelOf('xbox', anchor).inside).toBeLessThan(120);
  });

  it('keeps the PlayStation stick and button leaders short inside the body', () => {
    expect(labelOf('playstation', 'stick.right').inside).toBeLessThan(20);
    expect(labelOf('playstation', 'meta.guide').inside).toBeLessThan(40);
  });

  it('puts the PlayStation Share and Options callouts above', () => {
    for (const anchor of ['meta.view', 'meta.menu'] as const) {
      const { elbowY, top } = labelOf('playstation', anchor);
      expect(elbowY).toBeLessThan(top);
    }
  });
});

describe('Xbox pad in a 1280 by 720 window', () => {
  it('puts View and Menu above the pad', () => {
    for (const anchor of ['meta.view', 'meta.menu'] as const) {
      const { elbowY, top } = labelOf('xbox', anchor, SMALL_WINDOW_METRICS);
      expect(elbowY).toBeLessThan(top);
    }
  });

  it('keeps the face, D-pad and stick callouts beside the pad, not below it', () => {
    const anchors = ['face.south', 'face.east', 'face.north', 'dpad.up', 'stick.left', 'stick.right'] as const;
    for (const anchor of anchors) {
      const { elbowY, bottom } = labelOf('xbox', anchor, SMALL_WINDOW_METRICS);
      expect(elbowY).toBeLessThanOrEqual(bottom);
    }
  });
});
