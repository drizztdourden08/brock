/* @layer electron-main @kind logic */
import { realpath, stat } from 'fs/promises';
import { dirname } from 'path';
import type { DocumentDropResult } from '@drizztdourden08/brock-core/platform';
import { absolutePath } from './absolute-path';
import type { DocumentAccess } from './document-access.type';
import { DROP_LIMIT } from './vet-drop.constants';
import { unsafeSegments } from './unsafe-segments';

const refused = (path: string, reason: string, kind: DocumentDropResult['kind'] = null): DocumentDropResult => ({ path, kind, granted: false, reason });

const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const vetFolder = (documents: DocumentAccess, real: string): DocumentDropResult => {
  try {
    return { path: documents.allowFolder(real), kind: 'folder', granted: true };
  } catch (error) {
    return refused(real, reasonOf(error), 'folder');
  }
};

const vetFile = (documents: DocumentAccess, real: string): DocumentDropResult => {
  const refusal = documents.folderRefusal(dirname(real));
  if (refusal !== null) return refused(real, refusal, 'file');
  return { path: documents.allow(real), kind: 'file', granted: true };
};

const vetOne = async (documents: DocumentAccess, path: unknown): Promise<DocumentDropResult> => {
  const spelled = typeof path === 'string' ? path : '';
  try {
    const full = absolutePath(path);
    if (unsafeSegments(spelled)) return refused(spelled, 'The path is not a plain path');
    const real = await realpath(full);
    const facts = await stat(real);
    if (facts.isDirectory()) return vetFolder(documents, real);
    if (facts.isFile()) return vetFile(documents, real);
    return refused(spelled, 'Only files and folders can be dropped');
  } catch (error) {
    return refused(spelled, reasonOf(error));
  }
};

const vetDrop = async (documents: DocumentAccess, paths: unknown): Promise<DocumentDropResult[]> => {
  if (!Array.isArray(paths)) throw new Error('A dropped path list must be an array');
  if (paths.length > DROP_LIMIT) throw new Error(`A drop can hold at most ${DROP_LIMIT} items`);
  const answers: DocumentDropResult[] = [];
  for (const path of paths) answers.push(await vetOne(documents, path));
  return answers;
};

export { vetDrop };
