/* @layer electron-main @kind logic */
import type { BridgeRequest } from './bridge.type';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const parseRequest = (line: string): BridgeRequest | null => {
  const data = parseJson(line);
  if (!isRecord(data)) return null;
  const { id, channel, args, mac } = data;
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id < 1) return null;
  if (typeof channel !== 'string' || typeof args !== 'string' || typeof mac !== 'string') return null;
  return { id, channel, args, mac };
};

export { parseRequest };
