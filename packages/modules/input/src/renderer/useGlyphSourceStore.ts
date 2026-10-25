/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { GlyphSourceState } from './glyph-source.type';

const useGlyphSourceStore = create<GlyphSourceState>()((set) => ({
  sources: [],
  add: (source) => {
    set(({ sources }) => ({ sources: [...sources, source] }));
    return () => set(({ sources }) => ({ sources: sources.filter((candidate) => candidate !== source) }));
  },
}));

export { useGlyphSourceStore };
