/* @layer renderer-shell @kind logic */
import { BASE64_CHUNK } from './capacitor.constants';

const toBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let at = 0; at < bytes.length; at += BASE64_CHUNK) binary += String.fromCharCode(...bytes.subarray(at, at + BASE64_CHUNK));
  return btoa(binary);
};

const fromBase64 = (text: string): Uint8Array => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

const base64 = { encode: toBase64, decode: fromBase64 };

export { base64 };
