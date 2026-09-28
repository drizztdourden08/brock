/* @layer electron-main @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { Sdl3Input } from './sdl3.type';

const loadSdl3Addon = (candidates: readonly string[], log: MainContext['log']): Sdl3Input | null => {
  const path = candidates.find((candidate) => existsSync(candidate));
  if (!path) {
    log(`input: the SDL3 addon was not found, controllers are off. Tried ${candidates.join(', ')}`, 'warn');
    return null;
  }
  try {
    return createRequire(import.meta.url)(path) as Sdl3Input;
  } catch (err) {
    log(`input: the SDL3 addon at ${path} failed to load: ${err instanceof Error ? err.message : String(err)}`, 'error');
    return null;
  }
};

export { loadSdl3Addon };
