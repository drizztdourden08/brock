/* @layer electron-main @kind logic */
import type { BridgeServerMessage } from './bridge.type';
import { bridgeProof } from './bridge-proof';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';
import { asReply } from './parse-reply';
import { secretMatches } from './secret-matches';

const asPush = ({ seq, event, args }: Record<string, unknown>): BridgeServerMessage | null =>
  (typeof seq === 'number' && typeof event === 'string' && Array.isArray(args) ? { type: 'push', seq, event, args } : null);

const asMessage = (data: unknown): BridgeServerMessage | null => {
  if (!isRecord(data)) return null;
  if (data.type === 'push') return asPush(data);
  if (data.type === 'ready') return typeof data.connectionId === 'string' ? { type: 'ready', connectionId: data.connectionId } : null;
  if (data.type !== 'reply') return null;
  const reply = asReply(data);
  return reply ? { type: 'reply', ...reply } : null;
};

const parseServerMessage = (line: string, sessionKey: string): BridgeServerMessage | null => {
  const data = parseJson(line);
  if (!isRecord(data) || typeof data.body !== 'string' || typeof data.mac !== 'string') return null;
  if (!secretMatches(data.mac, bridgeProof.message(sessionKey, data.body))) return null;
  return asMessage(parseJson(data.body));
};

export { parseServerMessage };
