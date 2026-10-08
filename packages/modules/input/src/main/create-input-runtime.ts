/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { InputOptions, InputRuntime } from './input-main.type';
import { addonCandidates } from './addon-candidates';
import { createControllerSource } from './controller-source';
import { createHapticPlayer } from '../haptics/haptic-player';
import { loadSdl3Addon } from './load-sdl3-addon';
import { createMappingDb } from './mapping-db';
import { UNAVAILABLE_ADDON } from './sdl3.constants';

const createInputRuntime = (ctx: MainContext, options: InputOptions): InputRuntime => {
  const { emit, files, paths, log } = ctx;
  const loaded = loadSdl3Addon(addonCandidates(options.addonPath), log);
  const addon = loaded ?? UNAVAILABLE_ADDON;
  const source = createControllerSource({ addon, emit, log });
  return {
    addon,
    status: () => ({ available: loaded !== null, sdlVersion: addon.version() }),
    source,
    haptics: createHapticPlayer(source.rumble),
    mappings: createMappingDb({ addon, files, paths, log, bundledPath: options.mappingDbPath }),
  };
};

export { createInputRuntime };
