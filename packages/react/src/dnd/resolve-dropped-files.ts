/* @layer renderer-shell @kind logic */
import type { DocumentDropResult } from '@drizztdourden08/brock-core';
import { hostApi } from '../host/host-api';
import { getPlatform } from '../platform/get-platform';
import type { DroppedFile, DroppedFiles, RejectedFile } from './dnd.type';

const pathOf = (file: File): string | null => {
  try {
    return getPlatform().filePicker.pathOf?.(file) ?? null;
  } catch {
    return null;
  }
};

const plain = (file: File): DroppedFile => ({ file, name: file.name, path: null, kind: 'file' });

const vetted = async (paths: string[]): Promise<DocumentDropResult[] | null> => {
  const api = hostApi();
  if (paths.length === 0 || typeof api?.documentVetDrop !== 'function') return null;
  try {
    return await api.documentVetDrop(paths);
  } catch {
    return null;
  }
};

const resolveDroppedFiles = async (list: readonly File[]): Promise<DroppedFiles> => {
  const paths = list.map(pathOf);
  const answers = await vetted(paths.filter((path): path is string => path !== null));
  const files: DroppedFile[] = [];
  const rejected: RejectedFile[] = [];
  let next = 0;
  list.forEach((file, at) => {
    if (paths[at] === null) {
      files.push(plain(file));
      return;
    }
    const answer = answers?.[next];
    next += 1;
    if (answer === undefined) files.push(plain(file));
    else if (answer.granted && answer.kind !== null) files.push({ file, name: file.name, path: answer.path, kind: answer.kind });
    else rejected.push({ name: file.name, reason: answer.reason ?? 'The path was refused' });
  });
  return { files, rejected };
};

export { resolveDroppedFiles };
