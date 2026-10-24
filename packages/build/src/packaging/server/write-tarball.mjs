/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tarGz } from './tar-gz.mjs';

/**
 * @param {{ outDir: string, prefix: string, arch: string, entries: { path: string, mode: number, data: Buffer | string }[] }} spec
 * @returns {string} the tarball written, <prefix>server-linux-<arch>.tar.gz
 */
const writeTarball = ({ outDir, prefix, arch, entries }) => {
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${prefix}server-linux-${arch}.tar.gz`);
  writeFileSync(file, tarGz(entries));
  return file;
};

export { writeTarball };
