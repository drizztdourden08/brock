/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { ensureElectron } from '../ensure-electron.mjs';
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { resolveElectronBinary, runInherit } from '../run.mjs';

const MAIN_ENTRY = join('dist', 'electron', 'main.js');

const mainOf = (rootDir) => {
  try {
    const { main } = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return typeof main === 'string' ? normalize(main) : null;
  } catch {
    return null;
  }
};

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
  await ensureSynced(rootDir, 'brock start');
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const target = mainOf(rootDir) === MAIN_ENTRY ? rootDir : entry;
  return runInherit(resolveElectronBinary(rootDir), [target, ...passthrough], { cwd: rootDir, env });
};

export { runStart };
