/* @layer electron-main @kind logic */
import { folderCandidates } from './folder-candidates';
import { folderLevels } from './folder-levels';
import { folderTestAnswer } from './folder-test-answer';
import { FOLDER_PROMPT_ALLOW, FOLDER_PROMPT_DENY, FOLDER_PROMPT_TITLE } from './grant-containing-folder.constants';
import { optionFlag } from './option-flag';
import type { FolderGrantContext, FolderGrantRequest, FolderOutcome } from './grant-containing-folder.type';

const declined = (reason: string): FolderOutcome => ({ folderGranted: false, reason });

const widestAllowed = (ctx: FolderGrantContext, file: string, levels: number): { folder: string } | { reason: string } => {
  const candidates = folderCandidates(file, levels);
  let reason = 'No folder can be granted here';
  for (let level = candidates.length - 1; level >= 0; level -= 1) {
    const folder = candidates[level] ?? '';
    const refusal = ctx.documents.folderRefusal(folder);
    if (refusal === null) return { folder };
    if (level === candidates.length - 1) reason = refusal;
  }
  return { reason };
};

const grantContainingFolder = async ({ ctx, tracking, profileId }: FolderGrantRequest, file: string, option: unknown): Promise<FolderOutcome> => {
  const levels = folderLevels(option);
  if (levels === null) return declined('The grantFolder option is not valid');
  try {
    const answer = folderTestAnswer(ctx);
    const optedIn = optionFlag(option, 'showOnAutomation');
    if (answer === null && !optedIn && ctx.flags.isAutomationLaunch()) return declined('The folder is not asked about in an automation launch');
    const chosen = widestAllowed(ctx, file, levels);
    if ('reason' in chosen) return declined(chosen.reason);
    const allowed =
      answer === null
        ? await ctx.dialogs.confirm({
            title: FOLDER_PROMPT_TITLE,
            message: `Allow ${ctx.product.name} to read and write the folder ${chosen.folder}?`,
            confirmLabel: FOLDER_PROMPT_ALLOW,
            cancelLabel: FOLDER_PROMPT_DENY,
            showOnAutomation: optedIn,
          })
        : answer === 'grant';
    if (!allowed) return declined('The folder was not allowed');
    const real = ctx.documents.allowFolder(chosen.folder);
    if (answer === null) await tracking.picked(profileId, real);
    return { folderGranted: true, folder: real };
  } catch (error) {
    return declined(error instanceof Error ? error.message : String(error));
  }
};

export { grantContainingFolder };
