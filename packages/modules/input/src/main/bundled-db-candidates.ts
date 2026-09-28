/* @layer electron-main @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { BUNDLED_DB_SPECIFIER, DB_FILE } from './mapping-db.constants';

const resolvePackagedDb = (): string[] => {
  try {
    return [createRequire(import.meta.url).resolve(BUNDLED_DB_SPECIFIER)];
  } catch {
    return [];
  }
};

const bundledDbCandidates = (configured: string | undefined): string[] => [
  ...(configured ? [configured] : []),
  ...(process.resourcesPath ? [join(process.resourcesPath, DB_FILE)] : []),
  ...resolvePackagedDb(),
];

export { bundledDbCandidates };
