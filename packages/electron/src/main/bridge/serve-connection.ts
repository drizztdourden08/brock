/* @layer electron-main @kind logic */
import type { Socket } from 'net';
import type { BridgeRequest, BridgeSession } from './bridge.type';
import { BRIDGE_PROTOCOL } from './bridge.constants';
import { answerRequest } from './answer-request';
import { bridgeProof } from './bridge-proof';
import { createLineReader } from './line-reader';
import { parseHello } from './parse-hello';
import { parseRequest } from './parse-request';
import { replyWriter } from './reply-writer';
import { secretMatches } from './secret-matches';

const serveConnection = (socket: Socket, session: BridgeSession): void => {
  const state = { key: null as string | null, admitted: false, lastId: 0 };
  const writer = replyWriter(socket, session.maxMessageBytes);
  const deadline = setTimeout(() => socket.destroy(), session.handshakeMs);
  const onHello = (line: string): void => {
    const hello = parseHello(line);
    if (!hello) return writer.refuse(null, 'the connection must start with a hello');
    const serverNonce = bridgeProof.nonce();
    state.key = bridgeProof.sessionKey(session.secret, hello.nonce, serverNonce);
    socket.write(`${JSON.stringify({ v: BRIDGE_PROTOCOL, hello: serverNonce, proof: bridgeProof.server(session.secret, hello.nonce, serverNonce) })}\n`);
    return undefined;
  };
  const signed = (request: BridgeRequest, key: string): boolean =>
    request.id > state.lastId && secretMatches(request.mac, bridgeProof.request(key, request.id, request.channel, request.args));
  const admit = (): boolean => {
    if (state.admitted) return true;
    clearTimeout(deadline);
    state.admitted = session.admit(socket);
    return state.admitted;
  };
  const onRequest = (line: string, key: string): void => {
    const request = parseRequest(line);
    if (!request) return writer.refuse(null, 'the message is not a bridge request');
    if (!signed(request, key)) return writer.refuse(request.id, 'unauthorized');
    if (!admit()) return writer.refuse(request.id, 'the bridge has too many clients');
    state.lastId = request.id;
    void answerRequest(request, session).then(writer.send);
    return undefined;
  };
  const onLine = (line: string): void => {
    if (!socket.writable) return;
    if (state.key === null) onHello(line);
    else onRequest(line, state.key);
  };
  socket.on('data', createLineReader(session.maxMessageBytes, onLine, () => writer.refuse(null, 'the message is larger than the bridge allows')));
  socket.on('error', () => socket.destroy());
  socket.once('close', () => clearTimeout(deadline));
};

export { serveConnection };
