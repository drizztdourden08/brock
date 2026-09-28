/* @layer tooling-scripts @kind constants */
const KNOWN_ROM_SHA1 = Object.freeze({
  '6D4F10A8B10E10DBE624CB23CF03B88BB8252973': 'us',
  '2E62494967FB0AFDF5DA1635607F9641DF7C6559': 'de',
  '229364A1B92A05167CD38609B1AA98F7041987CC': 'fr',
  C1C6C7F76FFF936C534FF11F87A54162FC0AA100: 'fr-c',
  '7C073A222569B9B8E8CA5FCB5DFEC3B5E31DA895': 'en',
  '461FCBD700D1332009C0E85A7A136E2A8E4B111E': 'es',
  '3C4D605EEFDA1D76F101965138F238476655B11D': 'pl',
  D0D09ED41F9C373FE6AFDCCAFBF0DA8C88D3D90D: 'pt',
  B2A07A59E64C498BC1B2F28728F9BF4014C8D582: 'redux',
  '9325C22EB0A2A1F0017157C8B620BC3A605CEDE1': 'redux',
  FA8ADFDBA2697C9A54D583A1284A22AC764C7637: 'nl',
  '43CD3438469B2C3FE879EA2F410B3EF3CB3F1CA4': 'sv',
});

const SNES_DEFAULTS = Object.freeze({
  wasm: {
    sourceDirs: ['core'],
    skipDirs: ['third_party', 'node_modules'],
    sourceExtensions: ['.c', '.h'],
    buildScript: 'core/wasm-build/build.mjs',
    output: 'apps/web/public/wasm',
    outputExtensions: ['.wasm', '.js'],
    emsdkDir: 'third_party/emsdk',
    emsdkRepo: 'https://github.com/emscripten-core/emsdk.git',
  },
  roms: {
    dir: 'test-roms',
    extensions: ['.sfc', '.smc'],
    assetExtension: '.dat',
    sha1: KNOWN_ROM_SHA1,
  },
  states: {
    fixturesDir: 'tests/fixtures/save-states',
    profilesDir: 'Data/profiles',
    savesDir: 'saves',
    manualDir: 'normal',
    quickDir: 'quick',
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
