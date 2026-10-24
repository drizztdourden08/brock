/* @layer electron-main @kind logic */
import { sep } from 'path';

const same = (path: string): string => path;

const pathInside = (root: string, target: string, key: (path: string) => string = same): boolean => {
  const from = key(root);
  const to = key(target);
  return to === from || to.startsWith(from.endsWith(sep) ? from : `${from}${sep}`);
};

export { pathInside };
