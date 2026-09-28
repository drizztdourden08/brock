/* @layer tooling-scripts @kind logic */
import { snesOptions } from '../snes-options.mjs';
import { buildWasm } from './build-wasm.mjs';
import { wasmStaleReason } from './wasm-stale.mjs';

/**
 * @param {{ sourceDirs?: string[], output?: string, buildScript?: string, emsdkDir?: string }} [overrides]
 * @returns {{ name: string, isStale: (worktree: object) => boolean, run: (worktree: object) => void }}
 */
const wasmBuild = (overrides = {}) => ({
  name: 'wasm-core',
  isStale: (worktree) => wasmStaleReason(worktree.path, snesOptions('wasm', worktree.workspace, overrides)) !== null,
  run: (worktree) => {
    buildWasm({ root: worktree.path, main: worktree.main, wasm: snesOptions('wasm', worktree.workspace, overrides), log: worktree.log });
  },
});

export { wasmBuild };
