/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { tarGz } from '../src/packaging/server/tar-gz.mjs';
import { serverManagedFiles } from '../src/platforms/server/server-managed-files.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-server-pack-');

const PRODUCT = {
  id: 'fixture',
  name: 'Fixture  App',
  appId: 'com.example.fixture',
  description: 'A fixture server',
  author: { name: 'Dev Person', email: 'dev@example.com' },
  repo: { owner: 'Owner', name: 'fixture' },
};

const CONFIG = { product: PRODUCT, targets: ['server'], server: { osPackages: ['bubblewrap', 'libssl3'], ports: [38290, 38291] } };

const BINARIES = { x64: Buffer.from('x64-node'), arm64: Buffer.from('arm64-node') };

const NO_DPKG = { available: () => false };

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const fakeNodeArchive = (version, arch, binary) =>
  tarGz([
    { path: `node-v${version}-linux-${arch}/LICENSE`, mode: 0o644, data: 'licence' },
    { path: `node-v${version}-linux-${arch}/bin/node`, mode: 0o755, data: binary },
    { path: `node-v${version}-linux-${arch}/bin/npm`, mode: 0o755, data: 'npm' },
  ]);

const fakeDownloads = (version, binaries, { lie = false } = {}) => {
  const files = {};
  for (const [arch, binary] of Object.entries(binaries)) files[`node-v${version}-linux-${arch}.tar.gz`] = fakeNodeArchive(version, arch, binary);
  const sums = Object.entries(files).map(([name, bytes]) => `${lie ? '0'.repeat(64) : sha256(bytes)}  ${name}`).join('\n');
  const calls = [];
  const download = async (url) => {
    calls.push(url);
    const name = url.split('/').pop();
    if (name === 'SHASUMS256.txt') return Buffer.from(`${sums}\n`);
    if (files[name]) return files[name];
    throw new Error(`unexpected ${url}`);
  };
  return { download, calls };
};

const appFolder = () => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'fixture', version: '1.4.0' }));
  put(root, 'dist/server/main.mjs', 'export const server = true;\n');
  for (const file of serverManagedFiles({ rootDir: root, config: CONFIG, modules: [] })) put(root, file.path, file.content);
  return root;
};

const listTar = (bytes) => {
  const tar = gunzipSync(bytes);
  const rows = [];
  for (let at = 0; at + 512 <= tar.length && tar[at] !== 0;) {
    const block = tar.subarray(at, at + 512);
    const text = (from, length) => block.toString('utf8', from, from + length).split('\0')[0];
    const size = parseInt(text(124, 12), 8);
    const sum = [...block].reduce((total, byte, index) => total + (index >= 148 && index < 156 ? 32 : byte), 0);
    rows.push({ name: text(0, 100), mode: parseInt(text(100, 8), 8), type: text(156, 1), size, valid: parseInt(text(148, 8), 8) === sum, owner: text(265, 32) });
    at += 512 + Math.ceil(size / 512) * 512;
  }
  return rows;
};

const managedFiles = (config = CONFIG, rootDir = tempDir()) =>
  Object.fromEntries(serverManagedFiles({ rootDir, config, modules: [] }).map((file) => [file.path, file.content]));

export { BINARIES, CONFIG, NO_DPKG, PRODUCT, appFolder, cleanup, fakeDownloads, listTar, managedFiles, put, tempDir };
