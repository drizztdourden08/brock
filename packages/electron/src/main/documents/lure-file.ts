/* @layer electron-main @kind logic */
import { extname } from 'path';
import { LURE_EXTENSIONS, LURE_NAMES } from './lure-files.constants';
import { pathSegments } from './path-segments';

const lureFile = (path: string): boolean => {
  const name = pathSegments(path).pop() ?? '';
  return LURE_NAMES.has(name) || LURE_EXTENSIONS.has(extname(name));
};

export { lureFile };
