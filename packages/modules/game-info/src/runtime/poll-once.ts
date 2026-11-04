/* @layer renderer-shell @kind logic */
import { useProviderStore } from '../provider/useProviderStore';
import { useGameInfoStore } from '../store/useGameInfoStore';
import { buildSections } from './build-sections';
import { diffSections } from './diff-sections';
import { readSections } from './read-prefs';

const pollOnce = (): void => {
  const provider = useProviderStore.getState().provider;
  if (provider === null) return;
  const snapshot = provider.read();
  const prev = useGameInfoStore.getState();
  const next = snapshot === null ? { blocks: {}, compact: {} } : buildSections(provider, snapshot, readSections());
  const changed = diffSections(prev.blocks, next.blocks, prev.compact, next.compact);
  if (changed.length > 0 || prev.snapshotAt === null) prev.publish({ ...next, changed });
};

export { pollOnce };
