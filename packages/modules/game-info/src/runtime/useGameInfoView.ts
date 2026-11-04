/* @layer renderer-shell @kind hook */
import { useWidgetSlice, widgetWindowId } from '@drizztdourden08/brock-react';
import { useGameInfoStore } from '../store/useGameInfoStore';
import type { GameInfoView } from './game-info-view.type';
import { GAME_INFO_SLICE } from './share-game-info.constants';
import { EMPTY_VIEW } from './game-info-view.constants';

const useGameInfoView = (): GameInfoView => {
  const slice = useWidgetSlice<GameInfoView>(GAME_INFO_SLICE, EMPTY_VIEW);
  const blocks = useGameInfoStore((s) => s.blocks);
  const compact = useGameInfoStore((s) => s.compact);
  const changed = useGameInfoStore((s) => s.changed);
  const running = useGameInfoStore((s) => s.running);
  const snapshotAt = useGameInfoStore((s) => s.snapshotAt);
  if (widgetWindowId() !== null) return slice;
  return { blocks, compact, changed, running, snapshotAt, customHidden: false };
};

export { useGameInfoView };
