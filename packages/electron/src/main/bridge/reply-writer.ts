/* @layer electron-main @kind logic */
import type { Socket } from 'net';
import type { BridgeReply, BridgeReplyWriter } from './bridge.type';
import { encodeMessage } from './encode-message';

const replyWriter = (socket: Socket, maxBytes: number): BridgeReplyWriter => {
  const lineOf = (reply: BridgeReply): string | null =>
    encodeMessage(reply, maxBytes) ?? encodeMessage({ id: reply.id, ok: false, error: 'the reply is not JSON or is larger than the bridge allows' }, maxBytes);
  return {
    send: (reply) => {
      const line = lineOf(reply);
      if (line && socket.writable) socket.write(line);
    },
    refuse: (id, error) => {
      if (!socket.writable) return;
      socket.end(lineOf({ id, ok: false, error }) ?? '', () => socket.destroy());
    },
  };
};

export { replyWriter };
