/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const readPackage = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {{ manifest: Record<string, any>, dir: string }[]} modules
 * @returns {{ id: string, project: string }[]} modules with an Android side, by Gradle project name
 */
const androidModules = (modules) => modules.flatMap((m) => {
  const pkg = readPackage(m.dir);
  if (!pkg?.name || !pkg.capacitor?.android?.src) return [];
  return [{ id: m.manifest.id, project: pkg.name.replace(/^@/, '').replace('/', '-') }];
});

export { androidModules };
