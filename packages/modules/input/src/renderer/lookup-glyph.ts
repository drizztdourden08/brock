/* @layer renderer-shell @kind logic */
import type { GlyphSource } from './glyph-source.type';

const lookupGlyph = (sources: readonly GlyphSource[], ask: (source: GlyphSource) => string | null | undefined): string | null => {
  for (const source of [...sources].reverse()) {
    const url = ask(source);
    if (url) return url;
  }
  return null;
};

export { lookupGlyph };
