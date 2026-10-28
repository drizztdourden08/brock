/* @layer electron-main @kind logic */
import { CLIPBOARD_LIMITS } from './clipboard-limits.constants';

const watchIdOf = (id: unknown): string => {
  if (typeof id !== 'string' || id === '' || id.length > CLIPBOARD_LIMITS.idChars) throw new Error('A clipboard watch needs an id of 1 to 64 characters');
  return id;
};

export { watchIdOf };
