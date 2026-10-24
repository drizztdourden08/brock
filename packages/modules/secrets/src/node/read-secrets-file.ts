/* @layer core @kind logic */
import { readFile } from 'node:fs/promises';
import type { NodeSecretRecord } from './node-secret-store.type';

const isMissing = (error: unknown): boolean => (error as NodeJS.ErrnoException | null)?.code === 'ENOENT';

const readSecretsFile = async (file: string): Promise<Record<string, NodeSecretRecord>> => {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, NodeSecretRecord>)
      : {};
  } catch (error) {
    if (isMissing(error)) return {};
    throw error;
  }
};

export { readSecretsFile };
