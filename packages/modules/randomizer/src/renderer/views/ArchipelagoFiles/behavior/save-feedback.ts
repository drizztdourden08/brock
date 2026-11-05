/* @layer renderer-shell @kind logic */
import type { SaveArchipelagoFilesResult } from '../../../../ipc/save-files.type';
import { CANCELLED_REASON } from './save-feedback.constants';
import type { SaveFeedback } from './save-feedback.type';

const feedbackOf = (result: SaveArchipelagoFilesResult, notice: string | undefined): SaveFeedback | null => {
  if (result.ok) {
    const saved = `Saved ${result.files.length} files to ${result.folder}`;
    return { tone: 'ok', text: notice === undefined ? saved : `${saved}. ${notice}` };
  }
  if (result.reason === CANCELLED_REASON) return null;
  return { tone: 'error', text: `Not saved: ${result.reason}` };
};

export { feedbackOf };
