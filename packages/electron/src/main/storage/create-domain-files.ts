/* @layer electron-main @kind logic */
import { rm, stat } from 'fs/promises';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import type { DomainFiles } from './domain-files.type';
import { listEntries } from './list-entries';
import { pathBytes } from './path-bytes';
import { readOrNull } from './read-or-null';
import { resolveInside } from './resolve-inside';
import { writeAtomic } from './write-atomic';

const assertFile = (rel: string): string => {
  if (rel.trim() === '' || rel === '.') throw new Error('a domain file needs a path inside the domain');
  return rel;
};

const readJsonAt = async <T>(full: string, fallback: T): Promise<T> => {
  const data = await readOrNull(full);
  return data === null ? fallback : (JSON.parse(stripBom(data.toString('utf8'))) as T);
};

const createDomainFiles = (domain: string, dirOf: () => string): DomainFiles => {
  const at = (rel = ''): string => resolveInside(dirOf(), rel);
  const file = (rel: string): string => at(assertFile(rel));
  return {
    domain,
    dir: dirOf,
    path: at,
    exists: async (rel) => (await stat(at(rel)).catch(() => null)) !== null,
    readJson: async (rel, fallback) => readJsonAt(file(rel), fallback),
    writeJson: async (rel, value) => writeAtomic(file(rel), `${JSON.stringify(value, null, 2)}\n`),
    readText: async (rel) => (await readOrNull(file(rel)))?.toString('utf8') ?? null,
    writeText: async (rel, text) => writeAtomic(file(rel), text),
    readBytes: async (rel) => {
      const data = await readOrNull(file(rel));
      return data ? new Uint8Array(data) : null;
    },
    writeBytes: async (rel, data) => writeAtomic(file(rel), data),
    list: async (dir = '') => listEntries(dirOf(), at(dir)),
    remove: async (rel) => rm(file(rel), { recursive: true, force: true }),
    size: async (rel = '') => pathBytes(at(rel)),
  };
};

export { createDomainFiles };
