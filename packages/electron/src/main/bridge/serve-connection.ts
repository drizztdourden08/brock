/* @layer electron-main @kind logic */
import type { Socket } from 'net';
import type { BridgeSession } from './bridge.type';
import { BRIDGE_PROTOCOL } from './bridge.constants';
import { answerRequest } from './answer-request';
import { bridgeProof } from './bridge-proof';
import { createLineReader } from './line-reader';
import { parseAuth } from './parse-auth';
import { parseHello } from './parse-hello';
import { parseRequest } from './parse-request';
import { replyWriter } from './reply-writer';
import { secretMatches } from './secret-matches';

const serveConnection = (socket: Socket, session: BridgeSession): void => {
  const state = { key: null as string | null, connectionId: null as string | null, lastId: 0, seq: 0 };
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
  const onAuth = (line: string, key: string): void => {
    const auth = parseAuth(line);
    if (auth === null || !secretMatches(auth, bridgeProof.auth(key))) return writer.refuse(null, 'unauthorized');
    clearTimeout(deadline);
    const push = (event: string, args: unknown[]): boolean => {
      state.seq += 1;
      return writer.signed(key, { type: 'push', seq: state.seq, event, args });
    };
    const connectionId = session.admit({ push });
    if (connectionId === null) return writer.refuse(null, 'the bridge has too many clients');
    state.connectionId = connectionId;
    writer.signed(key, { type: 'ready', connectionId });
    return undefined;
  };
  const onRequest = (line: string, key: string, connectionId: string): void => {
    const request = parseRequest(line);
    if (!request) return writer.refuse(null, 'the message is not a bridge request');
    const valid = request.id > state.lastId && secretMatches(request.mac, bridgeProof.request(key, request.id, request.channel, request.args));
    if (!valid) return writer.refuse(request.id, 'unauthorized');
    state.lastId = request.id;
    void answerRequest(request, session, connectionId).then((reply) => writer.signed(key, { type: 'reply', ...reply }));
    return undefined;
  };
  const onLine = (line: string): void => {
    if (!socket.writable) return;
    if (state.key === null) onHello(line);
    else if (state.connectionId === null) onAuth(line, state.key);
    else onRequest(line, state.key, state.connectionId);
  };
  socket.on('data', createLineReader(session.maxMessageBytes, onLine, () => writer.refuse(null, 'the message is larger than the bridge allows')));
  socket.on('error', () => socket.destroy());
  socket.once('close', () => {
    clearTimeout(deadline);
    if (state.connectionId !== null) session.release(state.connectionId);
  });
};

export { serveConnection };
