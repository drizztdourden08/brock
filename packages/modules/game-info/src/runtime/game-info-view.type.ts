/* @layer renderer-shell @kind types */
import type { SectionId } from '../provider/section-id.type';
import type { SectionBlocks } from '../store/game-info-state.type';

interface GameInfoView {
  blocks: SectionBlocks;
  compact: SectionBlocks;
  changed: readonly SectionId[];
  running: boolean;
  snapshotAt: number | null;
  customHidden: boolean;
}

export type { GameInfoView };
