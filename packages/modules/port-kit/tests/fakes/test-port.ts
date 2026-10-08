/* @layer core @kind test */
import type { PortDefinition } from '../../src/port/port-definition.type';
import type { RomDefinition } from '../../src/rom/rom.type';

const testPort = (rom: RomDefinition): PortDefinition => ({
  id: 'demo',
  core: {
    glue: './wasm/game.js',
    wasm: 'wasm/game.wasm',
    factory: 'GameCore',
    files: { assets: '/a.dat', sram: '/saves/sram.dat', state: '/saves/save{slot}.sav', scratchSlot: 98 },
    exports: { stop: 'WasmStop', saveState: 'WasmSaveState', loadState: 'WasmLoadState' },
  },
  rom,
  video: { mode: 'emscripten', context: 'webgl' },
  audio: { mode: 'emscripten-sdl' },
  saves: { quickSlots: 4 },
  assets: { extension: '.dat', extractors: [] },
});

export { testPort };
