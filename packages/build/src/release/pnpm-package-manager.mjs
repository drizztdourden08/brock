/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const USER_AGENT_PNPM = /\bpnpm\/(\d+\.\d+\.\d+[\w.+-]*)/;
const VERSION = /^\d+\.\d+\.\d+[\w.+-]*$/;
const PNPM_FIELD = /^pnpm@\d/;

/**
 * @returns {string | null} the running pnpm's version, else PATH's
 */
const pnpmVersion = () => {
  const running = USER_AGENT_PNPM.exec(process.env.npm_config_user_agent ?? '')?.[1];
  if (running) return running;
  const result = spawnSync('pnpm --version', { shell: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const found = result.status === 0 ? result.stdout.trim() : '';
  return VERSION.test(found) ? found : null;
};

/**
 * @param {string} dir a folder with package.json
 * @returns {boolean} its packageManager names a pnpm version
 */
const hasPnpmPackageManager = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return false;
  const { packageManager } = JSON.parse(readFileSync(file, 'utf8'));
  return typeof packageManager === 'string' && PNPM_FIELD.test(packageManager);
};

/**
 * @param {string} dir the repo root
 * @returns {{ status: 'present' | 'added' | 'unknown' | 'other' | 'missing', value?: string }}
 */
const ensurePnpmPackageManager = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return { status: 'missing' };
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (typeof pkg.packageManager === 'string') return { status: PNPM_FIELD.test(pkg.packageManager) ? 'present' : 'other', value: pkg.packageManager };
  const version = pnpmVersion();
  if (!version) return { status: 'unknown' };
  pkg.packageManager = `pnpm@${version}`;
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return { status: 'added', value: pkg.packageManager };
};

export { ensurePnpmPackageManager, hasPnpmPackageManager };
