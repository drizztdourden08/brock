/* @layer electron-main @kind logic */
import { connect } from 'net';
import type { BridgeLink, BridgeLinkEvents, BridgeLinkLimits } from './bridge-client.type';
import type { BridgeServerMessage } from './bridge.type';
import { BRIDGE_IMPOSTOR, BRIDGE_PROTOCOL } from './bridge.constants';
import { bridgeProof } from './bridge-proof';
import { createLineReader } from './line-reader';
import { parseHello } from './parse-hello';
import { parseJson } from './parse-json';
import { asReply } from './parse-reply';
import { parseServerMessage } from './parse-server-message';
import { readBridgeDiscovery } from './read-bridge-discovery';
import { secretMatches } from './secret-matches';

const openBridgeLink = (file: string, { maxBytes, handshakeMs }: BridgeLinkLimits, events: BridgeLinkEvents): Promise<BridgeLink> => new Promise((resolve, reject) => {
  const discovery = readBridgeDiscovery(file);
  const clientNonce = bridgeProof.nonce();
  const socket = connect({ path: discovery.endpoint });
  const state = { key: null as string | null, ready: false, seq: 0, reason: new Error('the app closed the bridge') };
  const fail = (message: string): void => {
    state.reason = new Error(message);
    socket.destroy();
  };
  const deadline = setTimeout(() => fail(`the app did not answer the bridge handshake within ${handshakeMs} ms`), handshakeMs);
  const onHello = (line: string): void => {
    const hello = parseHello(line);
    const expected = hello ? bridgeProof.server(discovery.secret, clientNonce, hello.nonce) : '';
    if (!hello?.proof || !secretMatches(hello.proof, expected)) return fail(BRIDGE_IMPOSTOR);
    state.key = bridgeProof.sessionKey(discovery.secret, clientNonce, hello.nonce);
    socket.write(`${JSON.stringify({ auth: bridgeProof.auth(state.key) })}\n`);
    return undefined;
  };
  const onMessage = (message: BridgeServerMessage, key: string): void => {
    if (message.type === 'reply') return events.onReply(message);
    if (message.type === 'push') {
      if (message.seq <= state.seq) return fail('the app sent a push out of order');
      state.seq = message.seq;
      return events.onPush(message.event, message.args);
    }
    if (state.ready) return fail('the app announced the connection twice');
    state.ready = true;
    clearTimeout(deadline);
    resolve({ connectionId: message.connectionId, sign: (id, channel, args) => bridgeProof.request(key, id, channel, args), write: (line) => socket.write(line), end: () => socket.end() });
    return undefined;
  };
  const onSignedLine = (line: string, key: string): void => {
    const message = parseServerMessage(line, key);
    if (message) return onMessage(message, key);
    const refusal = asReply(parseJson(line));
    return fail(refusal && !refusal.ok ? refusal.error : 'the app sent a message that is not signed with this session');
  };
  socket.on('data', createLineReader(maxBytes, (line) => (state.key === null ? onHello(line) : onSignedLine(line, state.key)), () => fail(`a reply is larger than ${maxBytes} bytes`)));
  socket.once('connect', () => socket.write(`${JSON.stringify({ v: BRIDGE_PROTOCOL, hello: clientNonce })}\n`));
  socket.on('error', (error) => {
    state.reason = new Error(`could not reach the app's bridge: ${error.message}`);
  });
  socket.once('close', () => {
    clearTimeout(deadline);
    reject(state.reason);
    events.onClose(state.reason);
  });
});

export { openBridgeLink };
