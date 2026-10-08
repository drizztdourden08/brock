/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { copyFile, mkdtemp, readdir, rm, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { promisify } from 'util';
import { openZipReader } from '@drizztdourden08/brock-electron/zip';
import type { ToolArchive } from '../tools.type';
import { findBinaries } from './find-binaries';
import { systemTar } from './system-tar';

const run = promisify(execFile);

const fromZip = async (archive: string, names: readonly string[], target: string): Promise<void> => {
  const zip = await openZipReader(archive);
  try {
    const files = zip.records.filter((record) => !record.name.endsWith('/'));
    const found = findBinaries(files.map((record) => record.name), names);
    for (const [name, entry] of found) {
      const record = files.find((candidate) => candidate.name === entry);
      if (record) await writeFile(join(target, name), await zip.read(record));
    }
  } finally {
    await zip.close();
  }
};

const fromTar = async (archive: string, names: readonly string[], target: string): Promise<void> => {
  const scratch = await mkdtemp(join(dirname(target), 'unpack-'));
  try {
    await run(systemTar(), ['-xf', archive, '-C', scratch], { windowsHide: true });
    const entries = await readdir(scratch, { recursive: true, withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath, entry.name));
    for (const [name, file] of findBinaries(files, names)) await copyFile(file, join(target, name));
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
};

const unpackInto = async (archive: string, kind: ToolArchive, names: readonly string[], target: string): Promise<void> => {
  if (kind === 'zip') return fromZip(archive, names, target);
  if (kind === 'tar') return fromTar(archive, names, target);
  if (names.length !== 1) throw new Error(`a download with no archive holds one binary, not ${names.length}`);
  return copyFile(archive, join(target, names[0] ?? ''));
};

export { unpackInto };
