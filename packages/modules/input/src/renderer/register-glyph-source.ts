/* @layer renderer-shell @kind logic */
import type { GlyphSource } from './glyph-source.type';
import { useGlyphSourceStore } from './useGlyphSourceStore';

const registerGlyphSource = (source: GlyphSource): (() => void) => useGlyphSourceStore.getState().add(source);

export { registerGlyphSource };
