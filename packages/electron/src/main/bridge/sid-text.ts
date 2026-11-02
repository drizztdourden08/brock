/* @layer electron-main @kind logic */
import type { SecurityBindings } from './bridge.type';

const sidText = (native: SecurityBindings, sid: unknown): string => {
  const text: unknown[] = [null];
  if (!sid || native.convertSid(sid, text) === 0) throw new Error('ConvertSidToStringSidW could not read a SID');
  try {
    return native.decode.string16(text[0]);
  } finally {
    native.free(text[0]);
  }
};

export { sidText };
