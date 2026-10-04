/* @layer electron-main @kind logic */
import { isAbsolute, join, normalize, relative } from 'path';

const resolveInside = (root: string, rel: string): string => {
  if (isAbsolute(rel) || /^[A-Za-z]:/.test(rel)) throw new Error(`path must be relative to its domain: ${rel}`);
  const full = join(root, normalize(rel));
  const back = relative(root, full);
  if (back.startsWith('..') || isAbsolute(back)) throw new Error(`path escapes its domain: ${rel}`);
  return full;
};

export { resolveInside };
