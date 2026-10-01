/* @layer renderer-shell @kind logic */
import type { ClipboardWriter } from '@drizztdourden08/tessera/primitives';
import { writeClipboard } from './write-clipboard';

const clipboardWriter: ClipboardWriter = async (text) => {
  if (!(await writeClipboard(text))) throw new Error('The clipboard did not take the text.');
};

export { clipboardWriter };
