/* @layer tooling-scripts @kind logic */
import { chmodSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SERVER_POSTINST, SERVER_PRERM } from '../../platforms/server/server.constants.mjs';
import { debControl } from './deb-control.mjs';
import { MODE_EXECUTABLE, MODE_FILE } from './server-packaging.constants.mjs';
import { readManagedFile } from './read-managed-file.mjs';

const put = (tree, path, data, mode) => {
  const file = join(tree, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  chmodSync(file, mode);
};

const sizeKib = (entries) => Math.ceil(entries.reduce((total, { data }) => total + Buffer.byteLength(data), 0) / 1024);

/**
 * @param {{ rootDir: string, outDir: string, prefix: string, arch: { name: string, deb: string }, version: string, product: object, osPackages: string[], entries: { path: string, mode: number, data: Buffer | string }[], runDpkg: (args: string[]) => { ok: boolean, out: string } }} spec
 * @returns {string} the .deb written, <prefix>server_<version>_<arch>.deb
 */
const writeDeb = ({ rootDir, outDir, prefix, arch, version, product, osPackages, entries, runDpkg }) => {
  const { id } = product;
  const tree = join(outDir, `deb-${arch.name}`);
  const file = join(outDir, `${prefix}server_${version}_${arch.deb}.deb`);
  rmSync(tree, { recursive: true, force: true });
  for (const entry of entries) put(tree, `opt/${entry.path}`, entry.data, entry.mode);
  put(tree, `usr/lib/systemd/system/${id}.service`, readManagedFile(rootDir, `build/server/${id}.service`), MODE_FILE);
  put(tree, 'DEBIAN/control', debControl({ id, version, arch: arch.deb, product, osPackages, installedSizeKib: sizeKib(entries) }), MODE_FILE);
  put(tree, 'DEBIAN/postinst', readManagedFile(rootDir, SERVER_POSTINST), MODE_EXECUTABLE);
  put(tree, 'DEBIAN/prerm', readManagedFile(rootDir, SERVER_PRERM), MODE_EXECUTABLE);
  put(tree, `usr/bin/${id}-server`, ['#!/bin/sh', `exec /opt/${id}/bin/${id}-server "$@"`, ''].join('\n'), MODE_EXECUTABLE);
  const built = runDpkg(['--root-owner-group', '--build', tree, file]);
  rmSync(tree, { recursive: true, force: true });
  if (!built.ok) throw new Error(`dpkg-deb failed for ${arch.name}: ${built.out}`);
  return file;
};

export { writeDeb };
