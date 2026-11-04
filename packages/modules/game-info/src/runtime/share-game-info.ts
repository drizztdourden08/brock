/* @layer renderer-shell @kind logic */
import { shareWithWidgets } from '@drizztdourden08/brock-react';
import type { Block } from '../provider/block.type';
import type { SectionBlocks } from '../store/game-info-state.type';
import { useGameInfoStore } from '../store/useGameInfoStore';
import type { GameInfoView } from './game-info-view.type';

const GAME_INFO_SLICE = 'game-info';

const isPlain = (block: Block): boolean => block.kind !== 'custom';

const stripCustom = (blocks: SectionBlocks): SectionBlocks =>
  Object.fromEntries(Object.entries(blocks).map(([id, list]) => [id, list.filter(isPlain)]));

const hasCustom = (blocks: SectionBlocks): boolean => Object.values(blocks).some((list) => list.some((block) => !isPlain(block)));

const shareGameInfo = (): (() => void) =>
  shareWithWidgets(useGameInfoStore, {
    kind: GAME_INFO_SLICE,
    pick: (state): GameInfoView => ({
      blocks: stripCustom(state.blocks),
      compact: stripCustom(state.compact),
      changed: state.changed,
      running: state.running,
      snapshotAt: state.snapshotAt,
      customHidden: hasCustom(state.blocks) || hasCustom(state.compact),
    }),
  });

export { GAME_INFO_SLICE, shareGameInfo };
