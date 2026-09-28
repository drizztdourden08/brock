/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { INSTALL_MANIFEST, STUB_VERSION } from './packaging.constants.mjs';

/**
 * @param {string} path
 */
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

/**
 * @param {string} url
 * @returns {Promise<Record<string, any> | null>}
 */
const previousManifest = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.log(`brock package: no previous ${INSTALL_MANIFEST} (${error?.message ?? error})`);
    return null;
  }
};

/**
 * @typedef {object} ManifestInput
 * @property {string} dir the folder holding this release's files
 * @property {string} repoUrl https://github.com/<owner>/<name>
 * @property {string} tag
 * @property {string} version
 * @property {{ stub: string, payload: string, directory: string }} names
 */

/**
 * @param {{ url: string } | null} entry
 * @param {string} tag
 */
const describeEntry = (entry, tag) => {
  if (!entry) return 'none';
  return entry.url.includes(`/${tag}/`) ? 'this release' : 'carried forward';
};

/**
 * @param {ManifestInput} input
 * @returns {Promise<string[]>} one line per entry: where it points
 */
const writeInstallManifest = async ({ dir, repoUrl, tag, version, names }) => {
  const previous = (await previousManifest(`${repoUrl}/releases/latest/download/${INSTALL_MANIFEST}`)) ?? {};
  const entryFor = (name, fallback, extra = {}) => {
    const path = join(dir, name);
    if (!existsSync(path)) return fallback ?? null;
    return { url: `${repoUrl}/releases/download/${tag}/${encodeURIComponent(name)}`, sha256: sha256(path), ...extra };
  };
  const setup = entryFor(names.payload, previous.setup, { args: ['--silent'] });
  const portable = entryFor(names.directory, previous.portable);
  const stub = entryFor(names.stub, previous.stub);
  if (!setup) throw new Error(`${INSTALL_MANIFEST}: no installer payload in this release and no previous manifest to carry one forward. The first release has to be a full one (--full).`);
  const manifest = { stubVersion: STUB_VERSION, version, stub, setup, portable };
  writeFileSync(join(dir, INSTALL_MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return [`setup ${describeEntry(setup, tag)}`, `portable ${describeEntry(portable, tag)}`, `stub ${describeEntry(stub, tag)}`];
};

export { writeInstallManifest };
