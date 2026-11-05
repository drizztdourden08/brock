/* @layer renderer-shell @kind logic */
import { currentRun } from '../../../session/store/current-run';
import type { TrackerProvider } from '../../../tracker';

const vanillaCache = new WeakMap<object, unknown>();

const feedPlacement = (provider: TrackerProvider<unknown>): unknown => {
  const run = currentRun();
  if (run.kind === 'seed') return run.placement ?? null;
  if (provider.vanilla === undefined) return null;
  if (!vanillaCache.has(provider)) vanillaCache.set(provider, provider.vanilla());
  return vanillaCache.get(provider);
};

export { feedPlacement };
