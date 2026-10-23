/* @layer electron-main @kind logic */
import type { BridgeRequest, BridgeRequestId } from './bridge.type';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const isRequestId = (id: unknown): id is BridgeRequestId => typeof id === 'string' || (typeof id === 'number' && Number.isFinite(id));

const parseRequest = (line: string): BridgeRequest | null => {
  const data = parseJson(line);
  if (!isRecord(data)) return null;
  const { v, id, secret, channel, args } = data;
  if (!isRequestId(id) || typeof secret !== 'string') return null;
  if (typeof v !== 'number' || typeof channel !== 'string' || !Array.isArray(args)) return null;
  return { v, id, secret, channel, args };
};

export { parseRequest };
