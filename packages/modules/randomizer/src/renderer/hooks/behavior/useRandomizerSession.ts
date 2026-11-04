/* @layer renderer-shell @kind hook */
import { useCallback, useSyncExternalStore } from 'react';
import { useSessionStore } from '../../../session';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import type { RandomizerSessionView } from '../use-randomizer-session.type';

const noUnsubscribe = (): void => undefined;

const useRandomizerSession = (): RandomizerSessionView => {
  const game = useRandomizerGame();
  const session = useSessionStore((state) => state.session);
  const status = useSessionStore((state) => state.status);
  const placement = useSessionStore((state) => state.placement);
  const subscribe = useCallback((notify: () => void) => (game ? game.core.subscribe(notify) : noUnsubscribe), [game]);
  const read = useCallback(() => game?.core.state().status === 'running', [game]);
  const gameRunning = useSyncExternalStore(subscribe, read);
  const summary = game && placement ? game.describe(placement) : null;
  return { session, status, summary, gameRunning };
};

export { useRandomizerSession };
