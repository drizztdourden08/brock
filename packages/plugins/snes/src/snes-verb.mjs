/* @layer tooling-scripts @kind logic */
import { copyAssetBlob } from './rom/copy-asset-blob-step.mjs';
import { romFileOf } from './rom/rom-file-of.mjs';
import { romVerb } from './rom/rom-verb.mjs';
import { checkState } from './states/check-state.mjs';
import { saveStateOf } from './states/save-state-of.mjs';
import { seedSaveStates } from './states/seed-save-states-step.mjs';
import { vaultVerb } from './vault/vault-verb.mjs';
import { wasmBuild } from './wasm/wasm-build-step.mjs';
import { wasmVerb } from './wasm/wasm-verb.mjs';

const GROUPS = { wasm: wasmVerb, rom: romVerb, vault: vaultVerb };

const usage = Object.values(GROUPS).map((verb) => verb.usage).join('\n');

const run = (positional, options, ctx) => {
  const [group, ...rest] = positional;
  const verb = GROUPS[group];
  if (!verb) throw new Error(`Unknown snes verb "${group ?? ''}".\n${usage}`);
  return verb.run(rest, options, ctx);
};

const snes = { usage, run, copyAssetBlob, seedSaveStates, wasmBuild, saveStateOf, checkState, romFileOf };

export { snes };
