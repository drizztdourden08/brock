/* @layer electron-main @kind logic */
import { connect } from 'net';
import type { BridgeDiscovery, BridgeLink, BridgeLinkEvents, BridgeLinkLimits } from './bridge.type';
import { BRIDGE_IMPOSTOR, BRIDGE_PROTOCOL } from './bridge.constants';
import { bridgeProof } from './bridge-proof';
import { createLineReader } from './line-reader';
import { parseHello } from './parse-hello';
import { parseReply } from './parse-reply';
import { readBridgeDiscovery } from './read-bridge-discovery';
import { secretMatches } from './secret-matches';

const openBridgeLink = (file: string, { maxBytes, handshakeMs }: BridgeLinkLimits, events: BridgeLinkEvents): Promise<BridgeLink> => new Promise((resolve, reject) => {
  const discovery: BridgeDiscovery = readBridgeDiscovery(file);
  const clientNonce = bridgeProof.nonce();
  const socket = connect({ path: discovery.endpoint });
  const state = { key: null as string | null, reason: new Error('the app closed the bridge') };
  const fail = (message: string): void => {
    state.reason = new Error(message);
    socket.destroy();
  };
  const deadline = setTimeout(() => fail(`the app did not answer the bridge handshake within ${handshakeMs} ms`), handshakeMs);
  const onHello = (line: string): void => {
    clearTimeout(deadline);
    const hello = parseHello(line);
    const expected = hello ? bridgeProof.server(discovery.secret, clientNonce, hello.nonce) : '';
    if (!hello?.proof || !secretMatches(hello.proof, expected)) return fail(BRIDGE_IMPOSTOR);
    const key = bridgeProof.sessionKey(discovery.secret, clientNonce, hello.nonce);
    state.key = key;
    resolve({ sign: (id, channel, args) => bridgeProof.request(key, id, channel, args), write: (line) => socket.write(line), end: () => socket.end() });
    return undefined;
  };
  const onReplyLine = (line: string): void => {
    const reply = parseReply(line);
    if (!reply) return fail('the app sent a reply that is not a bridge reply');
    if (reply.id === null && !reply.ok) state.reason = new Error(reply.error);
    events.onReply(reply);
    return undefined;
  };
  socket.on('data', createLineReader(maxBytes, (line) => (state.key === null ? onHello(line) : onReplyLine(line)), () => fail(`a reply is larger than ${maxBytes} bytes`)));
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
