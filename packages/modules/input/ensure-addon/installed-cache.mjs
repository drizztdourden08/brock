/* @layer tooling-scripts @kind logic */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { KIND, cacheRoot, commitEntry, readEntry, touchEntry } from '@drizztdourden08/build-cache/store';
import { prebuiltAssetOf } from './prebuilt-asset-of.mjs';
import { readAddonState } from './read-addon-state.mjs';
import { readJson } from './read-json.mjs';
import { sha256File } from './sha256-file.mjs';

const entryIdOf = (asset, platformArch, env) => ({
  root: cacheRoot(env),
  kind: KIND.ADDON_INSTALLED,
  name: asset.name,
  version: asset.tag,
  buildKey: platformArch,
});

const filesUnder = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
  const path = join(dir, item.name);
  return item.isDirectory() ? filesUnder(path, base) : [relative(base, path).split(sep).join('/')];
});

const isPlainName = (name) => name.length > 0 && !name.startsWith('/') && !/^[a-z]:/i.test(name) && !name.split('/').includes('..');

const intactFiles = (entry) => {
  const files = entry.manifest.files;
  if (!files || typeof files !== 'object') return null;
  const names = Object.keys(files);
  if (names.length === 0 || !names.every(isPlainName)) return null;
  try {
    return names.every((name) => sha256File(join(entry.filesDir, name)) === files[name]) ? names : null;
  } catch {
    return null;
  }
};

/**
 * @param {import('./index.d.mts').PrebuiltAsset} asset
 * @param {string} platformArch
 * @param {string} outDir where the addon files go
 * @param {Record<string, string | undefined>} env BROCK_BUILD_CACHE_DIR picks the cache root
 * @returns {boolean} true when every file matched its sha256 and was copied
 */
const restoreInstalledAddon = (asset, platformArch, outDir, env) => {
  try {
    const entry = readEntry(entryIdOf(asset, platformArch, env), { verify: false });
    const names = entry && intactFiles(entry);
    if (!entry || !names) return false;
    for (const name of names) {
      mkdirSync(dirname(join(outDir, name)), { recursive: true });
      copyFileSync(join(entry.filesDir, name), join(outDir, name));
    }
    touchEntry(entry);
    return true;
  } catch {
    return false;
  }
};

const storeFiles = async (id, { paths }, source) => {
  const names = filesUnder(paths.outDir);
  await commitEntry({
    ...id,
    fill: (filesDir) => {
      const files = {};
      for (const name of names) {
        mkdirSync(dirname(join(filesDir, name)), { recursive: true });
        copyFileSync(join(paths.outDir, name), join(filesDir, name));
        files[name] = sha256File(join(filesDir, name));
      }
      return Promise.resolve({ files, source });
    },
  });
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<"stored" | "present" | "unmatched" | "failed">} stored only for a current addon with no intact entry
 */
const rememberInstalled = async (job) => {
  const { paths, pins, env } = job;
  try {
    if (readAddonState(paths, pins) !== 'current') return 'unmatched';
    const id = entryIdOf(prebuiltAssetOf(pins, paths.platformArch), paths.platformArch, env);
    const existing = readEntry(id, { verify: false });
    if (existing && intactFiles(existing)) return 'present';
    await storeFiles(id, job, readJson(paths.markerFile)?.source ?? 'prebuilt');
    return 'stored';
  } catch {
    return 'failed';
  }
};

export { rememberInstalled, restoreInstalledAddon };
