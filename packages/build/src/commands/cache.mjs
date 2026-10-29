/* @layer tooling-scripts @kind logic */
import { cacheRoot, listEntries } from '@drizztdourden08/build-cache';

const MEGABYTE = 1024 * 1024;

const lineOf = ({ dir, manifest }) => {
  if (!manifest) return `  ? ${dir} (no readable manifest; it reads as a miss)`;
  const size = `${(manifest.sizeBytes / MEGABYTE).toFixed(1)} MB`;
  return `  ${manifest.kind} ${manifest.name}@${manifest.version} ${manifest.buildKey}  ${size}  last used ${manifest.lastUsedAt}`;
};

/**
 * @param {{ args?: string[] }} ctx args: list (the default)
 * @returns {number} 0 when listed
 */
const runCache = ({ args = [] }) => {
  const [sub = 'list'] = args;
  if (sub !== 'list') {
    console.error(`brock cache: unknown word "${sub}". Use brock cache list. Argus prunes the cache, Brock never deletes from it.`);
    return 1;
  }
  const root = cacheRoot();
  const entries = listEntries(root);
  console.log(`brock cache: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in ${root}`);
  for (const entry of entries) console.log(lineOf(entry));
  return 0;
};

export { runCache };
