/* @layer core @kind logic */
import type { World } from '../../world';
import type { TrackerInput } from '../types/tracker-input.type';
import type { TrackerProvider } from '../types/tracker-provider.type';
import { defaultWorldKey } from './default-world-key';
import { WORLD_CACHE_SIZE } from './read.constants';

const caches = new WeakMap<object, Map<string, World>>();

const cachedWorld = <P>(provider: TrackerProvider<P>, input: TrackerInput<P>): World => {
  const cache = caches.get(provider) ?? new Map<string, World>();
  caches.set(provider, cache);
  const key = provider.worldKey === undefined ? defaultWorldKey(input) : provider.worldKey(input);
  const hit = cache.get(key);
  if (hit !== undefined) {
    cache.delete(key);
    cache.set(key, hit);
    return hit;
  }
  const world = provider.world(input);
  cache.set(key, world);
  while (cache.size > WORLD_CACHE_SIZE) {
    const oldest = cache.keys().next();
    if (oldest.done === true) break;
    cache.delete(oldest.value);
  }
  return world;
};

export { cachedWorld };
