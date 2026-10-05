/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import { STAMP_SLACK_MS } from './storage.constants';

const keepsExisting = async (full: string, incoming: Date): Promise<boolean> => {
  const existing = await stat(full).catch(() => null);
  return existing !== null && existing.isFile() && existing.mtimeMs >= incoming.getTime() + STAMP_SLACK_MS;
};

export { keepsExisting };
