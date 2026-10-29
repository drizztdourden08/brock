/* @layer renderer-components @kind test */
import { describe, expect, it } from 'vitest';
import { FAMILY_OVERLAYS } from '../src/pad-overlay/family-overlays.constants';
import type { GlyphSource } from '../src/renderer/glyph-source.type';
import { slotViewsOf } from '../src/views/ControllerPage/behavior/slot-views';

const BUTTON_KINDS = new Set(['button', 'analog']);

describe('pad glyphs without a registered glyph source', () => {
  for (const [family, overlay] of Object.entries(FAMILY_OVERLAYS)) {
    it(`gives every ${family} button and shoulder a Tessera icon`, () => {
      const views = slotViewsOf(overlay.slots, []);
      for (const [index, view] of views.entries()) {
        const slot = overlay.slots[index];
        if (!slot || slot.glyph === '' || !BUTTON_KINDS.has(slot.kind)) continue;
        expect(view.glyph, slot.anchor).toBe('');
        expect(view.icon, `${slot.anchor} ${slot.glyph}`).toBeDefined();
      }
    });
  }

  it('prefers a registered image over the Tessera icon', () => {
    const source: GlyphSource = { button: (glyph) => `app://${glyph}.svg` };
    const slot = FAMILY_OVERLAYS.xbox.slots.find((candidate) => candidate.glyph === 'xbox-a');
    expect(slot).toBeDefined();
    const [view] = slotViewsOf(slot ? [slot] : [], [source]);
    expect(view?.glyph).toBe('app://xbox-a.svg');
    expect(view?.icon).toBeUndefined();
  });
});
