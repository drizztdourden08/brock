/* @layer tooling-scripts @kind logic */
import { BROCK_PACKAGE, DEPENDENCY_BLOCKS, PIN_FIELD } from './upgrade.constants.mjs';

const isRegistrySpec = (spec) => /^[\^~]?\d/.test(spec);

const brockEntries = (pkg) =>
  DEPENDENCY_BLOCKS.flatMap((block) =>
    Object.entries(pkg[block] ?? {})
      .filter(([name]) => BROCK_PACKAGE.test(name))
      .map(([name, spec]) => ({ block, name, spec: String(spec) })));

/**
 * @param {Record<string, any>} pkg an app package.json
 * @param {string} fallback pinned when brock.version is absent
 * @returns {{ pkg: Record<string, any>, changed: string[] }}
 */
const followBrockPin = (pkg, fallback) => {
  const entries = brockEntries(pkg);
  if (entries.every(({ spec }) => spec.startsWith('workspace:'))) return { pkg, changed: [] };
  const version = pkg.brock?.version ?? fallback;
  const next = JSON.parse(JSON.stringify(pkg));
  const changed = [];
  if (pkg.brock?.version !== version) {
    next.brock = { ...next.brock, version };
    changed.push(PIN_FIELD);
  }
  for (const { block, name, spec } of entries) {
    if (!isRegistrySpec(spec) || spec === `^${version}`) continue;
    next[block][name] = `^${version}`;
    changed.push(`${block}.${name}`);
  }
  return { pkg: next, changed };
};

export { followBrockPin };
