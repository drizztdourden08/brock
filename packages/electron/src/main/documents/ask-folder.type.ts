/* @layer electron-main @kind types */
import type { FolderTestAnswer } from './folder-test-answer.type';
import type { FolderGrantContext } from './grant-containing-folder.type';

interface FolderQuestion {
  ctx: FolderGrantContext;
  folder: string;
  answer: FolderTestAnswer | null;
  optedIn: boolean;
}

export type { FolderQuestion };
