/* @layer renderer-shell @kind types */
import type { Block } from '../provider/block.type';
import type { SectionId } from '../provider/section-id.type';

type SectionBlocks = Partial<Record<SectionId, Block[]>>;

interface GameInfoPublish {
  blocks: SectionBlocks;
  compact: SectionBlocks;
  changed: readonly SectionId[];
}

interface GameInfoState {
  snapshotAt: number | null;
  blocks: SectionBlocks;
  compact: SectionBlocks;
  changed: readonly SectionId[];
  running: boolean;
  publish: (next: GameInfoPublish) => void;
  setRunning: (on: boolean) => void;
  reset: () => void;
}

export type { GameInfoPublish, GameInfoState, SectionBlocks };
