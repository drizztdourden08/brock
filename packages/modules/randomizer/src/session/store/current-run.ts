/* @layer renderer-shell @kind logic */
import type { ActiveRun } from './active-run.type';
import { sessionFactories } from './session-factories';
import { useSessionStore } from './session-store';

const currentRun = (): ActiveRun => {
  const { session, placement } = useSessionStore.getState();
  if (session === null || session.status === 'idle' || session.status === 'error') return { kind: 'normal' };
  if (placement !== null && sessionFactories.get(session.kind)?.placementBacked === true) return { kind: 'seed', placement };
  return { kind: session.kind };
};

export { currentRun };
