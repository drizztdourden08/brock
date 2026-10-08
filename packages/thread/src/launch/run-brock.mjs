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
 * @param {string[]} args
 * @param {{ inherit?: boolean }} [opts] inherit streams the output
 * @returns {{ status: number | null, output: string } | null} null when the app has no brock-build
 */
const runBrock = (appDir, args, { inherit = false } = {}) => {
  const bin = brockBin(appDir);
  if (!bin) return null;
  const result = spawnSync(process.execPath, [bin, ...args], { cwd: appDir, encoding: 'utf8', stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'] });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
};

export { runBrock };
