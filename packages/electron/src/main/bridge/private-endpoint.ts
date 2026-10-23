/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { chmodSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { PrivateEndpoint } from './bridge.type';
import { BRIDGE_DIR_MODE, BRIDGE_PIPE_PREFIX, BRIDGE_SOCKET_FILE } from './bridge.constants';

const safeName = (app: string): string => app.replace(/[^a-z0-9.-]/gi, '-').slice(0, 40);

const privateEndpoint = (app: string, platform: NodeJS.Platform = process.platform): PrivateEndpoint => {
  if (platform === 'win32') return { path: `${BRIDGE_PIPE_PREFIX}brock-${safeName(app)}-${randomBytes(16).toString('hex')}`, dir: null };
  const dir = mkdtempSync(join(tmpdir(), 'brock-'));
  chmodSync(dir, BRIDGE_DIR_MODE);
  return { path: join(dir, BRIDGE_SOCKET_FILE), dir };
};

export { privateEndpoint };
