/* @layer electron-main @kind logic */
import { chmodSync, rmSync } from 'fs';
import type { Server } from 'net';
import type { PrivateEndpoint } from './bridge.type';
import { BRIDGE_FILE_MODE, BRIDGE_LISTEN_TRIES } from './bridge.constants';
import { privateEndpoint } from './private-endpoint';

const listenOn = (server: Server, path: string): Promise<void> => new Promise((resolve, reject) => {
  const onError = (error: Error): void => {
    server.off('listening', onListening);
    reject(error);
  };
  const onListening = (): void => {
    server.off('error', onError);
    resolve();
  };
  server.once('error', onError);
  server.once('listening', onListening);
  server.listen({ path, exclusive: true, readableAll: false, writableAll: false });
});

const listenPrivate = async (server: Server, app: string, tries = BRIDGE_LISTEN_TRIES): Promise<PrivateEndpoint> => {
  const endpoint = privateEndpoint(app);
  try {
    await listenOn(server, endpoint.path);
  } catch (error) {
    if (endpoint.dir) rmSync(endpoint.dir, { recursive: true, force: true });
    if (tries <= 1) throw error;
    return listenPrivate(server, app, tries - 1);
  }
  if (endpoint.dir) chmodSync(endpoint.path, BRIDGE_FILE_MODE);
  return endpoint;
};

export { listenPrivate };
