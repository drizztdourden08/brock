/* @layer electron-main @kind logic */
import { toJson } from './to-json';

const encodeMessage = (value: unknown, maxBytes: number): string | null => {
  const text = toJson(value);
  return text === null || Buffer.byteLength(text, 'utf8') > maxBytes ? null : `${text}\n`;
};

export { encodeMessage };
