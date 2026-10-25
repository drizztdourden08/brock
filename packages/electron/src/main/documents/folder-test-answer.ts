/* @layer electron-main @kind logic */
import { ANSWER_FOLDER_GRANTS_FLAG, FOLDER_TEST_ANSWERS } from './folder-test-answer.constants';
import type { FolderTestAnswer } from './folder-test-answer.type';
import type { FolderGrantContext } from './grant-containing-folder.type';
import { isPackagedApp } from './is-packaged-app';

const warned = new WeakSet();

const ignored = (ctx: FolderGrantContext, why: string): null => {
  if (!warned.has(ctx.flags)) {
    warned.add(ctx.flags);
    ctx.log(`${ANSWER_FOLDER_GRANTS_FLAG} ignored: ${why}`);
  }
  return null;
};

const folderTestAnswer = (ctx: FolderGrantContext): FolderTestAnswer | null => {
  if (!ctx.flags.hasFlag(ANSWER_FOLDER_GRANTS_FLAG)) return null;
  if (!ctx.flags.isHeadlessLaunch()) return ignored(ctx, 'this is not a headless automation launch');
  if (isPackagedApp()) return ignored(ctx, 'this is a packaged app');
  const value = ctx.flags.flagValue(ANSWER_FOLDER_GRANTS_FLAG);
  const answer = FOLDER_TEST_ANSWERS.find((known) => known === value);
  return answer ?? ignored(ctx, 'the value is not grant or decline');
};

export { folderTestAnswer };
