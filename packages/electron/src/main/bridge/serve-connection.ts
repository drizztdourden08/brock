/* @layer electron-main @kind logic */
import type { Socket } from 'net';
import type { BridgeReply, BridgeRequestId, BridgeSession } from './bridge.type';
import { answerRequest } from './answer-request';
import { encodeMessage } from './encode-message';
import { createLineReader } from './line-reader';
import { parseRequest } from './parse-request';
import { secretMatches } from './secret-matches';

const serveConnection = (socket: Socket, session: BridgeSession): void => {
  const lineOf = (reply: BridgeReply): string | null =>
    encodeMessage(reply, session.maxMessageBytes)
    ?? encodeMessage({ id: reply.id, ok: false, error: 'the reply is not JSON or is larger than the bridge allows' }, session.maxMessageBytes);
  const send = (reply: BridgeReply): void => {
    const line = lineOf(reply);
    if (line && socket.writable) socket.write(line);
  };
  const refuse = (id: BridgeRequestId | null, error: string): void => {
    if (!socket.writable) return;
    socket.end(lineOf({ id, ok: false, error }) ?? '', () => socket.destroy());
  };
  const deadline = setTimeout(() => socket.destroy(), session.firstMessageMs);
  const onLine = (line: string): void => {
    if (!socket.writable) return;
    const request = parseRequest(line);
    if (!request) return refuse(null, 'the message is not a bridge request');
    if (!secretMatches(request.secret, session.secret)) return refuse(request.id, 'unauthorized');
    clearTimeout(deadline);
    void answerRequest(request, session.routes).then(send);
    return undefined;
  };
  socket.on('data', createLineReader(session.maxMessageBytes, onLine, () => refuse(null, 'the message is larger than the bridge allows')));
  socket.on('error', () => socket.destroy());
  socket.once('close', () => clearTimeout(deadline));
};

export { serveConnection };
