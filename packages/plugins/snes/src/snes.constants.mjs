/* @layer tooling-scripts @kind constants */
import { WASM_DEFAULTS } from '@drizztdourden08/brock-port-kit/ensure-wasm';

const SNES_DEFAULTS = Object.freeze({
  wasm: {
    ...WASM_DEFAULTS,
    sourceExtensions: ['.c', '.h'],
    emsdkRepo: 'https://github.com/emscripten-core/emsdk.git',
  },
  roms: {
    dir: 'test-roms',
    extensions: ['.sfc', '.smc'],
    assetExtension: '.dat',
    sha1: {},
  },
  states: {
    fixturesDir: 'tests/fixtures/save-states',
    profilesDir: 'Data/profiles',
    savesDir: 'saves',
    manualDir: 'normal',
    quickDir: 'quick',
    launchFlags: { game: ['--start-game'], save: ['--load-state={state}'] },
  },
  vault: {
    dir: null,
    envVar: null,
    treeDir: 'tree',
    managedRoots: ['tests/fixtures/save-states'],
    stateFile: '.vault-state.json',
    maxMirroredDeletions: 10,
    safetyNamespace: 'refs/safety',
  },
});

const SMC_HEADER_SIZE = 0x200;

export { SMC_HEADER_SIZE, SNES_DEFAULTS };
