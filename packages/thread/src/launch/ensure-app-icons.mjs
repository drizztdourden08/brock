/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const brockBin = (appDir) => {
  try {
    const manifest = createRequire(join(appDir, 'package.json')).resolve('@drizztdourden08/brock-build/package.json');
    const { bin } = JSON.parse(readFileSync(manifest, 'utf8'));
    return join(dirname(manifest), typeof bin === 'string' ? bin : bin.brock);
  } catch {
    return null;
  }
};

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {void}
 */
const ensureAppIcons = (appDir, log) => {
  const bin = brockBin(appDir);
  if (!bin) return;
  const result = spawnSync(process.execPath, [bin, 'icons'], { cwd: appDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) log(`brock icons failed before launch: ${(result.stderr || result.stdout).trim()}`);
};

export { ensureAppIcons };
