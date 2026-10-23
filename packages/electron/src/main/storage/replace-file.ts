/* @layer electron-main @kind logic */
import type { AtomicFileOps } from './write-atomic.type';
import { RENAME_BUSY_CODES, RENAME_RETRIES, RENAME_RETRY_MS } from './storage.constants';

const isBusy = (error: unknown): boolean => {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  return typeof code === 'string' && RENAME_BUSY_CODES.includes(code);
};

const replaceFile = async (partial: string, full: string, ops: AtomicFileOps): Promise<void> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await ops.rename(partial, full);
      return;
    } catch (error) {
      if (!isBusy(error) || attempt >= RENAME_RETRIES) throw error;
      await ops.pause(RENAME_RETRY_MS * (attempt + 1));
    }
  }
};

export { replaceFile };
