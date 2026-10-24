/* @layer electron-main @kind logic */
import { pathKey } from './path-key';

const rootNamed = (roots: ReadonlySet<string>, spellings: ReadonlyMap<string, string>, full: string): string | undefined => {
  const key = pathKey(full);
  return spellings.get(key) ?? [...roots].find((root) => pathKey(root) === key);
};

export { rootNamed };
