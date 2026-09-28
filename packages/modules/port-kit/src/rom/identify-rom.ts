/* @layer core @kind logic */
import type { RomCheck, RomDefinition } from './rom.type';
import { sha1Hex } from './sha1-hex';

const identifyRom = async (bytes: Uint8Array, definition: RomDefinition): Promise<RomCheck> => {
  const { known, normalize } = definition;
  const normalized = normalize ? normalize(bytes) : bytes;
  const hash = await sha1Hex(normalized);
  const identity = known[hash] ?? known[hash.toLowerCase()];
  if (!identity) return { ok: false, hash, reason: 'unknown' };
  return { ok: true, rom: { bytes: normalized, hash, identity } };
};

export { identifyRom };
