/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import { dirname, join } from 'path';
import type { DocumentWriteCheck } from '@drizztdourden08/brock-core/platform';
import { absolutePath } from './absolute-path';
import { NOT_A_FOLDER, WRITE_PROBE_NAME } from './can-write.constants';
import type { FolderGrants } from './folder-grants.type';
import { newTarget } from './new-target';

const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const canWrite = async (folders: FolderGrants, folder: unknown): Promise<DocumentWriteCheck> => {
  try {
    const probe = await newTarget(folders, join(absolutePath(folder), WRITE_PROBE_NAME));
    const real = dirname(probe);
    if (!(await stat(real)).isDirectory()) return { ok: false, reason: `"${real}" ${NOT_A_FOLDER}` };
    return { ok: true, path: real };
  } catch (error) {
    return { ok: false, reason: reasonOf(error) };
  }
};

export { canWrite };
