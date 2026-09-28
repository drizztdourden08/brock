/* @layer renderer-shell @kind hook */
import { useSyncExternalStore } from 'react';
import type { CoreState, GameCore } from './game-core.type';

const useCoreState = (core: GameCore): CoreState => useSyncExternalStore(core.subscribe, core.state, core.state);

export { useCoreState };
