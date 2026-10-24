/* @layer electron-main @kind logic */
import type { BridgeReply } from './bridge.type';
import { isRecord } from './is-record';

const asReply = (data: unknown): BridgeReply | null => {
  if (!isRecord(data)) return null;
  const { id, ok, value, error, code } = data;
  if (id !== null && typeof id !== 'string' && typeof id !== 'number') return null;
  if (ok === true) return { id, ok, value };
  if (ok !== false || typeof error !== 'string') return null;
  return { id, ok, error, ...(typeof code === 'string' ? { code } : {}), ...('data' in data ? { data: data.data } : {}) };
};

export { asReply };
