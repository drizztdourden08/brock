/* @layer renderer-components @kind logic */
import { lookupGlyph } from '../../../renderer/lookup-glyph';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import type { GlyphSource } from '../../../renderer/glyph-source.type';

const glyphUrl = (
  keys: readonly string[],
  sources: readonly GlyphSource[] = useGlyphSourceStore.getState().sources,
): string | null => {
  for (const key of keys) {
    const url = lookupGlyph(sources, (source) => source.button?.(key));
    if (url) return url;
  }
  return null;
};

export { glyphUrl };
