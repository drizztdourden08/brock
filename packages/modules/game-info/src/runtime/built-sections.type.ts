/* @layer renderer-shell @kind types */
import type { SectionBlocks } from '../store/game-info-state.type';

interface BuiltSections {
  blocks: SectionBlocks;
  compact: SectionBlocks;
}

export type { BuiltSections };
