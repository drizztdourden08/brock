/* @layer tooling-scripts @kind logic */
import { relative } from 'node:path';
import { loadBrockConfig } from '../load-config.mjs';
import { syncApp } from '../modules/sync.mjs';

/**
 * @param {{ rootDir: string, check?: boolean}} ctx
 * @returns {Promise<number>} exit code
 */
const runSync = async ({ rootDir, check = false }) => {
  const config = await loadBrockConfig(rootDir);
  const result = syncApp(rootDir, config, { check });
  const label = relative(process.cwd(), rootDir) || '.';
  if (check) {
    if (!result.drifted.length) {
      console.log(`brock check: ${label} is in sync (${result.modules.length} module(s)).`);
      return 0;
    }
    console.error(`brock check: ${result.drifted.length} managed file(s) drifted in ${label}:`);
    for (const path of result.drifted) console.error(`  ${path}`);
    console.error('Run `brock sync` to regenerate them.');
    return 1;
  }
  if (!result.written.length) console.log(`brock sync: ${label} already in sync.`);
  else {
    console.log(`brock sync: wrote ${result.written.length} file(s) in ${label}:`);
    for (const path of result.written) console.log(`  ${path}`);
  }
  for (const m of result.modules) console.log(`  module ${m.id} <- ${m.package}@${m.version}`);
  return 0;
};

export { runSync };
