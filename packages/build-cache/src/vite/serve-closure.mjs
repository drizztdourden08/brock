/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { blockedBy } from '../packages/blocked-by.mjs';
import { packageClosure } from '../packages/package-closure.mjs';
import { servePackage } from '../packages/serve-package.mjs';

/**
 * @typedef {{ served: Map<string, Map<string, string>>, importsOf: Map<string, Record<string, string[]>>, built: number }} ServedClosure
 */

/**
 * @param {{ root: string, rootDir: string, scope: string, key: { settings: Record<string, unknown>, buildKey: string }, warn: (line: string) => void }} input
 * @returns {Promise<ServedClosure>} served: placed file by export key, by package
 */
const serveClosure = async ({ root, rootDir, scope, key, warn }) => {
  const usable = [...packageClosure(rootDir, { scope, skipUi: true }).values()].filter((source) => !source.problem);
  const results = await Promise.allSettled(usable.map((source) => servePackage({ root, rootDir, source, ...key })));
  const failed = new Set();
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') return;
    failed.add(usable[index].name);
    warn(`build-cache: ${usable[index].name} is compiled in, its cache entry failed: ${result.reason?.message ?? result.reason}`);
  });
  const blocked = blockedBy(usable, failed);
  const served = new Map();
  const importsOf = new Map();
  let built = 0;
  usable.forEach((source, index) => {
    if (blocked.has(source.name)) return;
    const { placedDir, imports, built: fresh } = results[index].value;
    if (fresh) built += 1;
    served.set(source.name, new Map(source.entries.map((entry) => [entry.key, join(placedDir, `${entry.out}.js`)])));
    importsOf.set(source.name, imports);
  });
  return { served, importsOf, built };
};

/**
 * @param {Set<string>} usedKeys name|key of each served import
 * @param {ServedClosure} closure what serveClosure gave
 * @returns {string[]} packages the served code loads from the app
 */
const runtimeImportsOf = (usedKeys, { served, importsOf }) => {
  const names = new Set();
  const queue = [...usedKeys];
  const seen = new Set();
  const follow = (dep) => {
    if (served.has(dep)) queue.push(...Object.keys(importsOf.get(dep) ?? {}).map((key) => `${dep}|${key}`));
    else names.add(dep);
  };
  while (queue.length > 0) {
    const item = queue.shift();
    if (seen.has(item)) continue;
    seen.add(item);
    const [name, key] = item.split('|');
    for (const dep of importsOf.get(name)?.[key] ?? []) follow(dep);
  }
  return [...names].sort();
};

export { runtimeImportsOf, serveClosure };
