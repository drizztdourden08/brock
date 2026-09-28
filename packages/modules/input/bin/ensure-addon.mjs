/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { ensureAddon, ensureModeOf } from '../ensure-addon/index.mjs';
import { LOG_TAG } from '../ensure-addon/addon.constants.mjs';

const mode = ensureModeOf(process.argv.slice(2));
const log = (message) => console.log(`${LOG_TAG} ${message}`);

try {
  const result = await ensureAddon({ packageDir: resolve(import.meta.dirname, '..'), mode, env: process.env, log });
  if (result !== 'skipped') log(`SDL3 addon: ${result}.`);
  if (mode === 'force' && result === 'failed') process.exitCode = 1;
} catch (error) {
  console.error(`${LOG_TAG} ${error instanceof Error ? error.message : String(error)}`);
  if (mode === 'force') process.exitCode = 1;
}
