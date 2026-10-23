/* @layer electron-main @kind logic */
import type { BridgeHello } from './bridge.type';
import { BRIDGE_NONCE, BRIDGE_PROTOCOL } from './bridge.constants';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const parseHello = (line: string): BridgeHello | null => {
  const data = parseJson(line);
  if (!isRecord(data) || data.v !== BRIDGE_PROTOCOL) return null;
  const { hello, proof } = data;
  if (typeof hello !== 'string' || !BRIDGE_NONCE.test(hello)) return null;
  return { nonce: hello, proof: typeof proof === 'string' ? proof : null };
};

export { parseHello };
