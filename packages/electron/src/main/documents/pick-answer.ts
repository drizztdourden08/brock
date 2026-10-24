/* @layer electron-main @kind logic */
import type { DocumentPick } from '@drizztdourden08/brock-core/platform';
import { grantContainingFolder } from './grant-containing-folder';
import type { FolderGrantRequest } from './grant-containing-folder.type';

const pickAnswer = async (request: FolderGrantRequest, file: string, option: unknown): Promise<string | DocumentPick> => {
  if (option === undefined) return file;
  return { path: file, ...(await grantContainingFolder(request, file, option)) };
};

export { pickAnswer };
