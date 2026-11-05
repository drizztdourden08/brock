/* @layer renderer-shell @kind logic */
import { useSessionStore } from '../../../session/store/behavior/useSessionStore';
import type { TrackerProvider } from '../../../tracker';
import { NO_KEYS } from './tracker-feed.constants';

const completedKeys = (provider: TrackerProvider<unknown>, sampled: ReadonlySet<string>): Set<string> => {
  const reported = useSessionStore.getState().session?.reported?.() ?? NO_KEYS;
  return new Set([...reported, ...(provider.completed?.() ?? NO_KEYS), ...sampled]);
};

export { completedKeys };
