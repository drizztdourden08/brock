/* @layer electron-main @kind logic */
import { isAbsolute, resolve } from 'path';
import type { DocumentAccess } from './document-access.type';
import { pathKey as keyOf } from './path-key';

const absolute = (path: unknown): string => {
  if (typeof path !== 'string' || path === '' || path.includes('\0') || !isAbsolute(path)) {
    throw new Error('A document path must be an absolute path');
  }
  return resolve(path);
};

const createDocumentAccess = (): DocumentAccess => {
  const allowed = new Map<string, string>();
  const allow = (path: string): string => {
    const full = absolute(path);
    allowed.set(keyOf(full), full);
    return full;
  };
  const isAllowed = (path: string): boolean => {
    try {
      return allowed.has(keyOf(absolute(path)));
    } catch {
      return false;
    }
  };
  return {
    allow,
    isAllowed,
    resolve: (path) => {
      const full = absolute(path);
      const granted = allowed.get(keyOf(full));
      if (granted === undefined) throw new Error(`The renderer may not use "${full}": pick it in a document dialog first`);
      return granted;
    },
  };
};

export { createDocumentAccess };
