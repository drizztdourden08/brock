/* @layer renderer-shell @kind types */
interface GlyphSource {
  button?: (glyph: string) => string | null | undefined;
  controller?: (family: string) => string | null | undefined;
}

interface GlyphSourceState {
  sources: readonly GlyphSource[];
  add: (source: GlyphSource) => () => void;
}

export type { GlyphSource, GlyphSourceState };
