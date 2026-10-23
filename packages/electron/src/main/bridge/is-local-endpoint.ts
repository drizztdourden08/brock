/* @layer electron-main @kind logic */
import { isAbsolute } from 'path';
import { BRIDGE_PIPE_PREFIX } from './bridge.constants';

const isLocalEndpoint = (endpoint: string, platform: NodeJS.Platform = process.platform): boolean => {
  if (endpoint.includes('\0')) return false;
  if (platform === 'win32') return endpoint.startsWith(BRIDGE_PIPE_PREFIX) && endpoint.length > BRIDGE_PIPE_PREFIX.length;
  return isAbsolute(endpoint);
};

export { isLocalEndpoint };
