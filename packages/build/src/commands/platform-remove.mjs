/* @layer tooling-scripts @kind logic */
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { resolveModules } from '../modules/resolve.mjs';
import { platformManagedFiles } from '../platforms/platform-managed-files.mjs';
import { removeTarget } from '../platforms/remove-target.mjs';
import { configTargets } from './config-targets.mjs';
import { runSync } from './sync.mjs';

/**
 * @param {string} rootDir
 * @param {string[]} inputs ids and bundles, already checked
 * @returns {Promise<number>} exit code
 */
const runPlatformRemove = async (rootDir, inputs) => {
  const { targets, write } = configTargets(rootDir);
  const next = inputs.reduce(removeTarget, targets);
  if (!write(next)) {
    console.log(`brock platform: targets ${targets.join(', ')} do not include ${inputs.join(', ')}`);
    return 0;
  }
  console.log(`brock platform: targets ${targets.join(', ')} -> ${next.join(', ') || '(none)'}`);
  const config = await loadBrockConfig(rootDir);
  const { modules } = resolveModules(rootDir, config.modules ?? []);
  const kept = new Set(platformManagedFiles({ rootDir, config: { ...config, targets: next }, modules }).map((file) => file.path));
  const dropped = platformManagedFiles({ rootDir, config: { ...config, targets }, modules })
    .map((file) => file.path)
    .filter((path) => !kept.has(path) && existsSync(join(rootDir, path)));
  for (const path of dropped) rmSync(join(rootDir, path));
  if (dropped.length) console.log(`brock platform: removed the managed ${dropped.join(', ')}`);
  console.log('brock platform: folders a platform scaffolded (mobile/ for android) stay; delete them when you are done with them.');
  return runSync({ rootDir });
};

export { runPlatformRemove };
