/* @layer electron-main @kind logic */
import { FOLDER_PROMPT_ALLOW, FOLDER_PROMPT_DENY, FOLDER_PROMPT_TITLE } from './grant-containing-folder.constants';
import type { FolderQuestion } from './ask-folder.type';

const askFolder = async ({ ctx, folder, answer, optedIn }: FolderQuestion): Promise<boolean> => {
  if (answer !== null) return answer === 'grant';
  return ctx.dialogs.confirm({
    title: FOLDER_PROMPT_TITLE,
    message: `Allow ${ctx.product.name} to read and write the folder ${folder}?`,
    confirmLabel: FOLDER_PROMPT_ALLOW,
    cancelLabel: FOLDER_PROMPT_DENY,
    showOnAutomation: optedIn,
  });
};

export { askFolder };
