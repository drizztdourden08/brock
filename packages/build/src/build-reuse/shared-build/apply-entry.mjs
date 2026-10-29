/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { touchEntry } from '@drizztdourden08/build-cache/store';
import { storeFile, writeStore } from '../reuse-store.mjs';
import { localOutputs } from './portable-outputs.mjs';
import { RECORD_FILE } from './shared-build.constants.mjs';

const placed = (base, rel) => {
  const path = resolve(base, rel);
  const from = relative(base, path);
  if (from === '' || from.startsWith('..') || isAbsolute(from)) throw new Error(`the build cache names a path outside ${base}: ${rel}`);
  return path;
};

const writeOutput = (outDir, { fileName, base64 }) => {
  const path = placed(outDir, fileName);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(base64, 'base64'));
};

/**
 * @param {{ entry: NonNullable<ReturnType<typeof import('@drizztdourden08/build-cache/store').readEntry>>, rootDir: string, target: string }} input the verified entry, the app root and the bundle
 * @returns {void} writes the out files and the reuse record
 */
const applyEntry = ({ entry, rootDir, target }) => {
  const record = JSON.parse(readFileSync(join(entry.filesDir, RECORD_FILE), 'utf8'));
  const outputs = localOutputs(record.outputs, rootDir);
  const outDir = placed(rootDir, entry.manifest.outDir);
  for (const output of outputs) writeOutput(outDir, output);
  if (!writeStore(storeFile(rootDir, target), { ...record, outputs })) throw new Error('the reuse record could not be written');
  touchEntry(entry);
};

export { applyEntry };
