/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SERVER_ARCHES, SERVER_NODE_SHA256 } from '../../platforms/server/server.constants.mjs';
import { NODE_DIST_URL } from './server-packaging.constants.mjs';
import { readTarGzEntry } from './read-tar-gz-entry.mjs';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const listedHash = (sums, file) => {
  const line = sums.split('\n').map((text) => text.trim().split(/\s+/)).find(([, name]) => name === file);
  return line ? line[0].toLowerCase() : null;
};

const cachedArchive = (archivePath, hashPath, pin) => {
  if (!existsSync(archivePath) || !existsSync(hashPath)) return null;
  const bytes = readFileSync(archivePath);
  const actual = sha256(bytes);
  return actual === readFileSync(hashPath, 'utf8').trim() && (!pin || actual === pin) ? bytes : null;
};

const wantedHash = async ({ version, file, download, pin }) => {
  const sums = (await download(`${NODE_DIST_URL}/v${version}/SHASUMS256.txt`)).toString('utf8');
  const listed = listedHash(sums, file);
  if (!listed) throw new Error(`SHASUMS256.txt of Node ${version} does not list ${file}; check server.node.`);
  if (pin && listed !== pin) throw new Error(`SHASUMS256.txt lists sha256 ${listed} for ${file}, but Brock pins ${pin}. Nothing was staged.`);
  return pin ?? listed;
};

const verifiedArchive = async ({ version, file, download, archivePath, hashPath, pin }) => {
  const wanted = await wantedHash({ version, file, download, pin });
  const bytes = await download(`${NODE_DIST_URL}/v${version}/${file}`);
  const actual = sha256(bytes);
  const checkedAgainst = pin ? 'the pinned sha256' : `SHASUMS256.txt only (Node ${version} has no pin in Brock)`;
  if (actual !== wanted) throw new Error(`${file} does not match ${checkedAgainst}: expected ${wanted}, got ${actual}. Nothing was staged.`);
  if (!pin) console.log(`brock server package: Node ${version} has no pin; ${file} was checked against SHASUMS256.txt only.`);
  mkdirSync(join(archivePath, '..'), { recursive: true });
  writeFileSync(archivePath, bytes);
  writeFileSync(hashPath, `${actual}\n`);
  return bytes;
};

/**
 * @param {{ version: string, arch: 'x64' | 'arm64', cacheDir: string, download: (url: string) => Promise<Buffer>, pins?: Record<string, Record<string, string>> }} request
 * @returns {Promise<Buffer>} node, once its sha256 matches the pin
 */
const fetchNodeBinary = async ({ version, arch, cacheDir, download, pins = SERVER_NODE_SHA256 }) => {
  const folder = `node-v${version}-linux-${SERVER_ARCHES[arch].node}`;
  const file = `${folder}.tar.gz`;
  const archivePath = join(cacheDir, file);
  const hashPath = `${archivePath}.sha256`;
  const pin = pins[version]?.[arch] ?? null;
  const archive = cachedArchive(archivePath, hashPath, pin) ?? (await verifiedArchive({ version, file, download, archivePath, hashPath, pin }));
  const binary = readTarGzEntry(archive, (name) => name.replace(/^\.\//, '') === `${folder}/bin/node`);
  if (!binary) throw new Error(`${file} has no ${folder}/bin/node.`);
  return binary;
};

export { fetchNodeBinary };
