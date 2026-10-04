/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { knipConfigFor } from '@drizztdourden08/standards/knip';
import { knipBin } from './knip-bin.mjs';

const PREPROCESSOR = join(import.meta.dirname, '..', 'knip-brock-dependencies.mjs');
const CONFIG_FILES = ['knip.json', '.knip.json'];
const asList = (value) => (value === undefined ? [] : [value].flat());

const configArgs = (rootDir) => {
  const source = CONFIG_FILES.find((name) => existsSync(join(rootDir, name)));
  const config = source ? knipConfigFor(rootDir) : null;
  if (!config) return [];
  const own = new Set(asList(JSON.parse(readFileSync(join(rootDir, source), 'utf8')).ignore));
  const dir = join(rootDir, 'node_modules', '.cache', 'brock');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'knip.json');
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
  const options = { source, injected: config.ignore.filter((glob) => !own.has(glob)) };
  return ['--no-gitignore', '--config', file, '--preprocessor-options', JSON.stringify(options)];
};

/**
 * @param {{ rootDir: string, args: string[] }} ctx
 * @returns {number} exit code
 */
const runKnip = ({ rootDir, args }) => {
  const bin = knipBin(rootDir);
  if (!bin) {
    console.error('brock knip: knip is not installed');
    return 1;
  }
  const knipArgs = [bin, ...configArgs(rootDir), '--preprocessor', PREPROCESSOR, ...args];
  return spawnSync(process.execPath, knipArgs, { cwd: rootDir, stdio: 'inherit' }).status ?? 1;
};

export { runKnip };
