/* @layer electron-main @kind logic */
import type { BridgeDiscovery } from './bridge.type';
import { checkSocketFolder } from './check-socket-folder';
import { isLocalEndpoint } from './is-local-endpoint';
import { isProcessAlive } from './is-process-alive';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';
import { readPrivateFile } from './read-private-file';

const asDiscovery = (data: unknown): BridgeDiscovery | null => {
  if (!isRecord(data)) return null;
  const { v, app, pid, endpoint, secret, startedAt } = data;
  if (typeof v !== 'number' || typeof app !== 'string' || typeof startedAt !== 'string') return null;
  if (typeof pid !== 'number' || typeof endpoint !== 'string' || typeof secret !== 'string') return null;
  return { v, app, pid, endpoint, secret, startedAt };
};

const readBridgeDiscovery = (file: string): BridgeDiscovery => {
  const text = readPrivateFile(file);
  const discovery = asDiscovery(parseJson(text));
  if (!discovery) throw new Error(`${file} is not a bridge discovery file.`);
  if (!isLocalEndpoint(discovery.endpoint)) throw new Error(`${file} names an endpoint that is not a local pipe or socket; the bridge refuses it.`);
  if (!isProcessAlive(discovery.pid)) throw new Error(`The app is not running: ${file} is left from a session that ended.`);
  const uid = process.getuid?.();
  if (uid !== undefined) checkSocketFolder(discovery.endpoint, uid);
  return discovery;
};

export { readBridgeDiscovery };
