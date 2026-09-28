/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ensureElectron } from '../ensure-electron.mjs';
import { resolveElectronBinary, runInherit } from '../run.mjs';

const MAIN_ENTRY = join('dist', 'electron', 'main.js');

/**
 * @param {{ rootDir: string, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runStart = async ({ rootDir, passthrough = [] }) => {
  const entry = join(rootDir, MAIN_ENTRY);
  if (!existsSync(entry)) {
    console.error(`brock start: ${MAIN_ENTRY} not found. Run \`brock build\` first.`);
    return 1;
  }
  const electron = ensureElectron(rootDir);
  if (!electron.ok) {
    console.error(`brock start: ${electron.message}`);
    return 1;
  }
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  return runInherit(resolveElectronBinary(rootDir), [entry, ...passthrough], { cwd: rootDir, env });
};

export { runStart };
