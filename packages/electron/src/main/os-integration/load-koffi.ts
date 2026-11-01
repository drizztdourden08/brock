/* @layer electron-main @kind logic */
import { createRequire } from 'module';
import type { Koffi } from './koffi.type';

const remembered: { koffi?: Koffi | null } = {};

const hasLoad = (value: unknown): value is Koffi => typeof value === 'object' && value !== null && 'load' in value && typeof value.load === 'function';

const attempt = (): Koffi | null => {
  try {
    const module: unknown = createRequire(import.meta.url)('koffi');
    return hasLoad(module) ? module : null;
  } catch {
    return null;
  }
};

const loadKoffi = (): Koffi | null => {
  if (process.platform !== 'win32') return null;
  remembered.koffi ??= attempt();
  return remembered.koffi;
};

export { loadKoffi };
