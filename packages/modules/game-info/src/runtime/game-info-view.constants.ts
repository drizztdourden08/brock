/* @layer renderer-shell @kind constants */
import type { GameInfoView } from './game-info-view.type';

const EMPTY_VIEW: GameInfoView = { blocks: {}, compact: {}, changed: [], running: false, snapshotAt: null, customHidden: false };

export { EMPTY_VIEW };
