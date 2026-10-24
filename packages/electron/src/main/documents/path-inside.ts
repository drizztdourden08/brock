/* @layer electron-main @kind logic */
import { isAbsolute, relative, sep } from 'path';
import { pathKey } from './path-key';

const pathInside = (root: string, target: string): boolean => {
  const back = relative(pathKey(root), pathKey(target));
  return back === '' || (back !== '..' && !back.startsWith(`..${sep}`) && !isAbsolute(back));
};

export { pathInside };
