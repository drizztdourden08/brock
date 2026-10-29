/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coordHome } from '../../local/coord-home.mjs';
import { copyFileAtomic, renameWithRetry, writeFileAtomic } from '../../local/atomic-write.mjs';

const MANIFEST = 'release.json';
const NOTES = 'notes.md';

/**
 * @param {{ project: string, channel: string, version: string }} release
 * @returns {string} ~/.coord/releases/<project>/<channel>/<version>
 */
const storeDir = ({ project, channel, version }) => join(coordHome(), 'releases', project, channel, version);

/**
 * @param {string} dir a version folder
 * @returns {boolean} the release is complete: release.json is written last
 */
const isReleased = (dir) => existsSync(join(dir, MANIFEST));

/**
 * @param {string} file
 * @returns {{ size: number, sha256: string, sha512: string }} sha256 in hex, sha512 in base64 like npm integrity
 */
const digestOf = (file) => {
  const bytes = readFileSync(file);
  return {
    size: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sha512: createHash('sha512').update(bytes).digest('base64'),
  };
};

/**
 * @param {string} dir
 * @param {string} name
 * @param {string} from a file made inside the version folder
 * @returns {string} the final path, moved in by a rename
 */
const moveIn = (dir, name, from) => {
  const target = join(dir, name);
  renameWithRetry(from, target);
  return target;
};

/**
 * @param {string} dir
 * @param {string} name
 * @param {string} from a file anywhere
 * @returns {string} the final path, copied in whole
 */
const copyIn = (dir, name, from) => {
  const target = join(dir, name);
  copyFileAtomic(from, target);
  return target;
};

/**
 * @param {string} dir
 * @param {string} text
 * @returns {void}
 */
const writeNotes = (dir, text) => writeFileAtomic(join(dir, NOTES), text);

/**
 * @param {string} dir
 * @param {object} manifest
 * @returns {string} the release.json path
 */
const writeManifest = (dir, manifest) => {
  const file = join(dir, MANIFEST);
  writeFileAtomic(file, `${JSON.stringify(manifest, null, 2)}\n`);
  return file;
};

export { copyIn, digestOf, isReleased, moveIn, storeDir, writeManifest, writeNotes };
