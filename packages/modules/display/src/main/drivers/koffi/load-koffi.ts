/* @layer electron-main @kind logic */
import { createRequire } from 'node:module';
import type { Koffi } from './koffi.type';

let cached: Koffi | null = null;
let attempted = false;

const isKoffi = (value: unknown): value is Koffi =>
  typeof value === 'object' && value !== null && 'load' in value && typeof value.load === 'function';

const requireKoffi = (): unknown => {
  try {
    const loaded: unknown = createRequire(import.meta.url)('koffi');
    return loaded;
  } catch {
    return null;
  }
};

const loadKoffi = (): Koffi | null => {
  if (attempted) return cached;
  attempted = true;
  const loaded = requireKoffi();
  cached = isKoffi(loaded) ? loaded : null;
  return cached;
};

export { loadKoffi };
