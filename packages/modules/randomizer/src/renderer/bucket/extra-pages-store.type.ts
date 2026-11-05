/* @layer renderer-shell @kind type */
import type { RandomizerPage } from './randomizer-page.type';

interface ExtraPagesState {
  pages: readonly RandomizerPage[];
  add(pages: readonly RandomizerPage[]): void;
}

export type { ExtraPagesState };
