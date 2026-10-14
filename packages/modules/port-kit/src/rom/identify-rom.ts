/* @layer core @kind logic */
import type { RomCheck, RomRules } from './rom.type';
import { sha1Hex } from './sha1-hex';

const identifyRom = async (bytes: Uint8Array, definition: RomRules): Promise<RomCheck> => {
  const { known, normalize, acceptUnknown } = definition;
  const normalized = normalize ? normalize(bytes) : bytes;
  const hash = await sha1Hex(normalized);
  const identity = known[hash] ?? known[hash.toLowerCase()];
  if (identity) return { ok: true, rom: { bytes: normalized, hash, identity } };
  if (!acceptUnknown) return { ok: false, hash, reason: 'unknown' };
  const id = hash.toLowerCase();
  return { ok: true, rom: { bytes: normalized, hash, identity: { id, label: id }, unknown: true } };
};

export { identifyRom };
