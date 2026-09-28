/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { runInherit } from '../run.mjs';
import { resolveModules } from './resolve.mjs';

/**
 * @param {string} rootDir
 * @param {string[]} ids module ids from brock.config.ts
 * @returns {Promise<void>} a failing step is reported, never thrown
 */
const prepareModules = async (rootDir, ids) => {
  const { modules } = resolveModules(rootDir, ids);
  for (const m of modules.filter((entry) => entry.manifest.prepare)) {
    const code = await runInherit(process.execPath, [join(m.dir, m.manifest.prepare)], { cwd: m.dir }).catch(() => 1);
    if (code !== 0) console.log(`brock: the ${m.manifest.id} module prepare step exited with ${code}; continuing.`);
  }
};

export { prepareModules };
