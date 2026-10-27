/* @layer electron-main @kind logic */
import { isBenignBrowserError } from '@drizztdourden08/brock-core/log';
import { IMPORT_FAILED, MAX_LENGTH, UNCAUGHT } from './load-error-of.constants';

const loadErrorOf = (message: string): string | null => {
  if (isBenignBrowserError(message)) return null;
  if (!UNCAUGHT.test(message) && !IMPORT_FAILED.test(message)) return null;
  const first = message.split('\n')[0]?.trim() ?? '';
  const cleaned = first.replace(/^Uncaught (\(in promise\) )?/, '');
  return cleaned.length > MAX_LENGTH ? `${cleaned.slice(0, MAX_LENGTH)}...` : cleaned;
};

export { loadErrorOf };
