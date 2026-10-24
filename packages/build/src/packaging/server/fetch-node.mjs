/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SERVER_ARCHES } from '../../platforms/server/server.constants.mjs';
import { NODE_DIST_URL } from './server-packaging.constants.mjs';
import { readTarGzEntry } from './read-tar-gz-entry.mjs';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const expectedHash = (sums, file) => {
  const line = sums.split('\n').map((text) => text.trim().split(/\s+/)).find(([, name]) => name === file);
  return line ? line[0].toLowerCase() : null;
};

const cachedArchive = (archivePath, hashPath) => {
  if (!existsSync(archivePath) || !existsSync(hashPath)) return null;
  const bytes = readFileSync(archivePath);
  return sha256(bytes) === readFileSync(hashPath, 'utf8').trim() ? bytes : null;
};

const verifiedArchive = async ({ version, file, download, archivePath, hashPath }) => {
  const base = `${NODE_DIST_URL}/v${version}`;
  const wanted = expectedHash((await download(`${base}/SHASUMS256.txt`)).toString('utf8'), file);
  if (!wanted) throw new Error(`SHASUMS256.txt of Node ${version} does not list ${file}; check server.node.`);
  const bytes = await download(`${base}/${file}`);
  const actual = sha256(bytes);
  if (actual !== wanted) throw new Error(`${file} does not match SHASUMS256.txt: expected sha256 ${wanted}, got ${actual}. Nothing was staged.`);
  mkdirSync(join(archivePath, '..'), { recursive: true });
  writeFileSync(archivePath, bytes);
  writeFileSync(hashPath, `${actual}\n`);
  return bytes;
};

/**
 * @param {{ version: string, arch: 'x64' | 'arm64', cacheDir: string, download: (url: string) => Promise<Buffer> }} request
 * @returns {Promise<Buffer>} node, once its sha256 matches nodejs.org
 */
const fetchNodeBinary = async ({ version, arch, cacheDir, download }) => {
  const folder = `node-v${version}-linux-${SERVER_ARCHES[arch].node}`;
  const file = `${folder}.tar.gz`;
  const archivePath = join(cacheDir, file);
  const hashPath = `${archivePath}.sha256`;
  const archive = cachedArchive(archivePath, hashPath) ?? (await verifiedArchive({ version, file, download, archivePath, hashPath }));
  const binary = readTarGzEntry(archive, (name) => name.replace(/^\.\//, '') === `${folder}/bin/node`);
  if (!binary) throw new Error(`${file} has no ${folder}/bin/node.`);
  return binary;
};

export { fetchNodeBinary };
