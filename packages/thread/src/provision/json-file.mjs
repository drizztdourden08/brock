/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const readObject = (path) => {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * @param {string} path
 * @returns {{ path: string, exists: () => boolean, read: () => Record<string, unknown> | null, write: (data: object) => void }}
 */
const jsonFile = (path) => ({
  path,
  exists: () => existsSync(path),
  read: () => readObject(path),
  write: (data) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  },
});

export { jsonFile };
