/* @layer electron-main @kind logic */
import type { BridgeReply } from './bridge.type';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const parseReply = (line: string): BridgeReply | null => {
  const data = parseJson(line);
  if (!isRecord(data)) return null;
  const { id, ok, value, error } = data;
  if (id !== null && typeof id !== 'string' && typeof id !== 'number') return null;
  if (ok === true) return { id, ok, value };
  return ok === false && typeof error === 'string' ? { id, ok, error } : null;
};

export { parseReply };
