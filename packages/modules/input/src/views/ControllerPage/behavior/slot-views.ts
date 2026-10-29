/* @layer renderer-components @kind logic */
import type { GlyphSource } from '../../../renderer/glyph-source.type';
import { lookupGlyph } from '../../../renderer/lookup-glyph';
import type { OverlaySlot } from '../../../pad-overlay/pad-overlay.type';
import type { OverlaySlotView } from '../../../composites/PadOverlay';
import { glyphIcon } from '../../../pad-overlay/glyph-icon';
import { FALLBACK_GLYPH } from '../ControllerPage.constants';

const glyphHref = (sources: readonly GlyphSource[], glyph: string): string =>
  (glyph === ''
    ? ''
    : (lookupGlyph(sources, (source) => source.button?.(glyph)) ?? lookupGlyph(sources, (source) => source.button?.(FALLBACK_GLYPH)) ?? ''));

const slotViewsOf = (slots: readonly OverlaySlot[], sources: readonly GlyphSource[]): OverlaySlotView[] =>
  slots.map((slot) => {
    const href = glyphHref(sources, slot.glyph);
    const icon = href === '' ? glyphIcon(slot.glyph) : null;
    return icon ? { ...slot, glyph: href, icon } : { ...slot, glyph: href };
  });

export { slotViewsOf };
