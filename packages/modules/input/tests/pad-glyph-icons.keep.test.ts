/* @layer renderer-components @kind test */
import { describe, expect, it } from 'vitest';
import { FAMILY_OVERLAYS } from '../src/pad-overlay/family-overlays.constants';
import type { GlyphSource } from '../src/renderer/glyph-source.type';
import { slotViewsOf } from '../src/views/ControllerPage/behavior/slot-views';

describe('K2 pad glyphs without a registered glyph source', { tags: ['critical'] }, () => {
  it('prefers a registered image over the Tessera icon', () => {
    const source: GlyphSource = { button: (glyph) => `app://${glyph}.svg` };
    const slot = FAMILY_OVERLAYS.xbox.slots.find((candidate) => candidate.glyph === 'xbox-a');
    expect(slot).toBeDefined();
    const [view] = slotViewsOf(slot ? [slot] : [], [source]);
    expect(view?.glyph).toBe('app://xbox-a.svg');
    expect(view?.icon).toBeUndefined();
  });
});
