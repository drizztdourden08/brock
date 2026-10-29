/* @layer tooling-scripts @kind logic */
import { cacheRoot, listEntries } from '@drizztdourden08/build-cache';
import { pruneStore } from '@drizztdourden08/brock-thread';

const MEGABYTE = 1024 * 1024;

const lineOf = ({ dir, manifest }) => {
  if (!manifest) return `  ? ${dir} (no readable manifest; it reads as a miss)`;
  const size = `${(manifest.sizeBytes / MEGABYTE).toFixed(1)} MB`;
  return `  ${manifest.kind} ${manifest.name}@${manifest.version} ${manifest.buildKey}  ${size}  last used ${manifest.lastUsedAt}`;
};

const listCache = () => {
  const root = cacheRoot();
  const entries = listEntries(root);
  console.log(`brock cache: ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in ${root}`);
  for (const entry of entries) console.log(lineOf(entry));
  return 0;
};

const pruneNodeModulesStores = async (args) => {
  try {
    await pruneStore({ cwd: process.cwd(), log: (line) => console.log(`brock cache: ${line}`), dryRun: args.includes('--dry-run') });
    return 0;
  } catch (error) {
    console.error(`brock cache: ${error.message}`);
    return 1;
  }
};

/**
 * @param {{ args?: string[] }} ctx args: list (the default) | prune-store [--dry-run]
 * @returns {number | Promise<number>} 0 when done
 */
const runCache = ({ args = [] }) => {
  const [sub = 'list', ...rest] = args;
  if (sub === 'list') return listCache();
  if (sub === 'prune-store') return pruneNodeModulesStores(rest);
  console.error(`brock cache: unknown word "${sub}". Use brock cache list or brock cache prune-store. Argus prunes the build cache, Brock never deletes from it.`);
  return 1;
};

export { runCache };
