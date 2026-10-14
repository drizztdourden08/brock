/* @layer core @kind logic */
import type { RomRules } from './rom.type';
import type { RomCandidate } from './rom-store.type';
import { hasRomExtension } from './has-rom-extension';
import { isZip } from './zip/is-zip';
import { zipCandidate } from './zip-candidate';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const romCandidate = async (fileName: string, bytes: Uint8Array, rules: RomRules): Promise<RomCandidate> => {
  const named = hasRomExtension(fileName, rules);
  if (!named && isZip(bytes)) {
    return zipCandidate(bytes, rules).catch((error: unknown): RomCandidate => ({ ok: false, reason: 'archive', message: `The zip cannot be read: ${messageOf(error)}` }));
  }
  if (!named) return { ok: false, reason: 'extension' };
  const fits = bytes.length > 0 && (rules.maxBytes === undefined || bytes.length <= rules.maxBytes);
  return fits ? { ok: true, name: fileName, bytes } : { ok: false, reason: 'size' };
};

export { romCandidate };
