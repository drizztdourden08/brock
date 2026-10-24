/* @layer electron-main @kind logic */
import type { DocumentRevealResult } from '@drizztdourden08/brock-core/platform';
import { pathPresent } from './path-present';

const refused = (reason: string): DocumentRevealResult => ({ revealed: false, reason });

const revealItem = async (resolve: (path: string) => Promise<string>, show: ((real: string) => void) | undefined, path: string): Promise<DocumentRevealResult> => {
  let real: string;
  try {
    real = await resolve(path);
  } catch (error) {
    return refused(error instanceof Error ? error.message : String(error));
  }
  if (show === undefined) return refused('The file manager is not available here');
  if (!(await pathPresent(real))) return refused(`"${real}" does not exist`);
  show(real);
  return { revealed: true };
};

export { revealItem };
