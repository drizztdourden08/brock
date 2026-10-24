/* @layer core @kind logic */
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { NodeSecretRecord } from './node-secret-store.type';
import { DIR_MODE, FILE_MODE } from './node-secret-store.constants';

const writeSecretsFile = async (file: string, records: Record<string, NodeSecretRecord>): Promise<void> => {
  await mkdir(dirname(file), { recursive: true, mode: DIR_MODE });
  const partial = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(partial, `${JSON.stringify(records, null, 2)}\n`, { encoding: 'utf8', mode: FILE_MODE });
    await rename(partial, file);
  } catch (error) {
    await rm(partial, { force: true });
    throw error;
  }
};

export { writeSecretsFile };
