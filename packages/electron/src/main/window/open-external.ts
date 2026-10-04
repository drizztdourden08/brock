/* @layer electron-main @kind logic */
import { shell } from 'electron';
import { appendMainLog } from '../logs/append-main-log';
import { externalProtocols } from './external-protocols';

const protocolOf = (url: string): string | null => {
  try {
    return new URL(url).protocol;
  } catch {
    return null;
  }
};

const openExternal = async (url: string): Promise<boolean> => {
  const protocol = protocolOf(url);
  if (protocol === null || !externalProtocols.allowed.has(protocol)) {
    appendMainLog('warn', `[security] refused to open ${protocol ?? 'an invalid'} link outside the app; allowed: ${[...externalProtocols.allowed].join(', ')}`);
    return false;
  }
  await shell.openExternal(url);
  return true;
};

export { openExternal };
