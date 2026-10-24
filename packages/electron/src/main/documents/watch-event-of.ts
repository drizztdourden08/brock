/* @layer electron-main @kind logic */
import type { DocumentWatchEvent } from '@drizztdourden08/brock-core/platform';
import { pathPresent } from './path-present';

const watchEventOf = async (path: string, renamed: boolean, check: (path: string) => Promise<boolean>): Promise<DocumentWatchEvent | null> => {
  try {
    if (!(await check(path))) return null;
    if (!(await pathPresent(path))) return { kind: 'remove', path };
    return { kind: renamed ? 'add' : 'change', path };
  } catch {
    return null;
  }
};

export { watchEventOf };
