/* @layer electron-main @kind logic */
import { isAbsolute } from 'path';
import { BRIDGE_PIPE_NAME, BRIDGE_PIPE_PREFIX } from './bridge.constants';

const isLocalEndpoint = (endpoint: string, platform: NodeJS.Platform = process.platform): boolean => {
  if (endpoint.includes('\0')) return false;
  if (platform !== 'win32') return isAbsolute(endpoint);
  return endpoint.startsWith(BRIDGE_PIPE_PREFIX) && BRIDGE_PIPE_NAME.test(endpoint.slice(BRIDGE_PIPE_PREFIX.length));
};

export { isLocalEndpoint };
