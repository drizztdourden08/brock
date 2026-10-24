/* @layer electron-main @kind logic */
import type { Socket } from 'net';
import type { BridgeReplyWriter, BridgeServerMessage } from './bridge.type';
import { BRIDGE_CODES, BRIDGE_TOO_LARGE } from './bridge.constants';
import { bridgeProof } from './bridge-proof';
import { encodeMessage } from './encode-message';
import { toJson } from './to-json';

const replyWriter = (socket: Socket, maxBytes: number): BridgeReplyWriter => {
  const signedLine = (key: string, message: BridgeServerMessage): string | null => {
    const body = toJson(message);
    return body === null ? null : encodeMessage({ body, mac: bridgeProof.message(key, body) }, maxBytes);
  };
  const fallback = (key: string, message: BridgeServerMessage): string | null =>
    (message.type === 'reply' ? signedLine(key, { type: 'reply', id: message.id, ok: false, error: BRIDGE_TOO_LARGE, code: BRIDGE_CODES.tooLarge }) : null);
  return {
    signed: (key, message) => {
      const line = signedLine(key, message) ?? fallback(key, message);
      if (!line || !socket.writable) return false;
      socket.write(line);
      return true;
    },
    refuse: (id, error) => {
      if (!socket.writable) return;
      socket.end(encodeMessage({ id, ok: false, error }, maxBytes) ?? '', () => socket.destroy());
    },
  };
};

export { replyWriter };
