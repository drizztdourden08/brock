/* @layer electron-main @kind logic */
import { createHmac, randomBytes } from 'crypto';
import { BRIDGE_NONCE_BYTES } from './bridge.constants';

const mac = (key: string, parts: readonly (string | number)[]): string => createHmac('sha256', key).update(JSON.stringify(parts), 'utf8').digest('base64url');

const bridgeProof = {
  nonce: (): string => randomBytes(BRIDGE_NONCE_BYTES).toString('base64url'),
  server: (secret: string, clientNonce: string, serverNonce: string): string => mac(secret, ['server', clientNonce, serverNonce]),
  sessionKey: (secret: string, clientNonce: string, serverNonce: string): string => mac(secret, ['session', clientNonce, serverNonce]),
  auth: (sessionKey: string): string => mac(sessionKey, ['auth']),
  request: (sessionKey: string, id: number, channel: string, args: string): string => mac(sessionKey, ['request', id, channel, args]),
  message: (sessionKey: string, body: string): string => mac(sessionKey, ['message', body]),
};

export { bridgeProof };
