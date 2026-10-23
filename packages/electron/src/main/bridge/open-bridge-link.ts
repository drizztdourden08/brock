/* @layer electron-main @kind logic */
import { connect } from 'net';
import type { BridgeLink, BridgeLinkEvents, BridgeReply } from './bridge.type';
import { createLineReader } from './line-reader';
import { parseReply } from './parse-reply';
import { readBridgeDiscovery } from './read-bridge-discovery';

const openBridgeLink = (file: string, maxBytes: number, events: BridgeLinkEvents): Promise<BridgeLink> => new Promise((resolve, reject) => {
  const discovery = readBridgeDiscovery(file);
  const socket = connect({ path: discovery.endpoint });
  const state = { open: false, reason: new Error('the app closed the bridge') };
  const fail = (message: string): void => {
    state.reason = new Error(message);
    socket.destroy();
  };
  const onReply = (reply: BridgeReply): void => {
    if (reply.id === null && !reply.ok) state.reason = new Error(reply.error);
    events.onReply(reply);
  };
  const onLine = (line: string): void => {
    const reply = parseReply(line);
    if (reply) onReply(reply);
    else fail('the app sent a reply that is not a bridge reply');
  };
  socket.on('data', createLineReader(maxBytes, onLine, () => fail(`a reply is larger than ${maxBytes} bytes`)));
  socket.once('connect', () => {
    state.open = true;
    resolve({ secret: discovery.secret, write: (line) => socket.write(line), end: () => socket.end() });
  });
  socket.on('error', (error) => {
    if (state.open) state.reason = new Error(`the bridge connection failed: ${error.message}`);
    else reject(new Error(`could not reach the app's bridge: ${error.message}`));
  });
  socket.once('close', () => events.onClose(state.reason));
});

export { openBridgeLink };
