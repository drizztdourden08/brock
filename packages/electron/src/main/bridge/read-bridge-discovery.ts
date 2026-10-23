/* @layer electron-main @kind logic */
import { readFileSync, statSync } from 'fs';
import type { BridgeDiscovery } from './bridge.type';
import { BRIDGE_OTHERS_MASK } from './bridge.constants';
import { isLocalEndpoint } from './is-local-endpoint';
import { isProcessAlive } from './is-process-alive';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const readText = (file: string): string => {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    throw new Error(`The app is not running, or its bridge is off: ${file} is missing.`);
  }
};

const checkPrivate = (file: string): void => {
  const uid = process.getuid?.();
  if (uid === undefined) return;
  const stat = statSync(file);
  if (stat.uid !== uid) throw new Error(`${file} belongs to another user; the bridge refuses it.`);
  if ((stat.mode & BRIDGE_OTHERS_MASK) !== 0) throw new Error(`${file} is open to other users; the bridge refuses it.`);
};

const asDiscovery = (data: unknown): BridgeDiscovery | null => {
  if (!isRecord(data)) return null;
  const { v, app, pid, endpoint, secret, startedAt } = data;
  if (typeof v !== 'number' || typeof app !== 'string' || typeof startedAt !== 'string') return null;
  if (typeof pid !== 'number' || typeof endpoint !== 'string' || typeof secret !== 'string') return null;
  return { v, app, pid, endpoint, secret, startedAt };
};

const readBridgeDiscovery = (file: string): BridgeDiscovery => {
  const text = readText(file);
  checkPrivate(file);
  const discovery = asDiscovery(parseJson(text));
  if (!discovery) throw new Error(`${file} is not a bridge discovery file.`);
  if (!isLocalEndpoint(discovery.endpoint)) throw new Error(`${file} names an endpoint that is not a local pipe or socket; the bridge refuses it.`);
  if (!isProcessAlive(discovery.pid)) throw new Error(`The app is not running: ${file} is left from a session that ended.`);
  return discovery;
};

export { readBridgeDiscovery };
