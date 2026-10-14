/* @layer core @kind logic */
import type { RomRules } from './rom.type';
import type { RomCandidate } from './rom-store.type';
import type { ZipEntry } from './zip/zip-read.type';
import { hasRomExtension } from './has-rom-extension';
import { identifyRom } from './identify-rom';
import { isZip } from './zip/is-zip';
import { readZipEntries } from './zip/read-zip-entries';

const fits = (size: number, rules: RomRules): boolean => size > 0 && (rules.maxBytes === undefined || size <= rules.maxBytes);

const entriesOf = (bytes: Uint8Array): ZipEntry[] | null => {
  try {
    return readZipEntries(bytes);
  } catch {
    return null;
  }
};

const knownOf = async (entries: ZipEntry[], rules: RomRules): Promise<RomCandidate> => {
  const read = await Promise.all(entries.map(async (entry) => ({ name: entry.name, bytes: await entry.read() })));
  const checks = await Promise.all(read.map(async (entry) => ({ entry, check: await identifyRom(entry.bytes, { ...rules, acceptUnknown: false }) })));
  const known = checks.filter(({ check }) => check.ok);
  const [only] = known;
  return only && known.length === 1 ? { ok: true, ...only.entry } : { ok: false, reason: 'archive' };
};

const fromZip = async (bytes: Uint8Array, rules: RomRules): Promise<RomCandidate> => {
  const roms = entriesOf(bytes)?.filter((entry) => hasRomExtension(entry.name, rules)) ?? [];
  const fitting = roms.filter((entry) => fits(entry.size, rules));
  if (fitting.length === 0) return { ok: false, reason: roms.length > 0 ? 'size' : 'archive' };
  const [only] = fitting;
  if (only && fitting.length === 1) return { ok: true, name: only.name, bytes: await only.read() };
  return knownOf(fitting, rules);
};

const romCandidate = async (fileName: string, bytes: Uint8Array, rules: RomRules): Promise<RomCandidate> => {
  const named = hasRomExtension(fileName, rules);
  if (!named && isZip(bytes)) return fromZip(bytes, rules).catch((): RomCandidate => ({ ok: false, reason: 'archive' }));
  if (!named) return { ok: false, reason: 'extension' };
  return fits(bytes.length, rules) ? { ok: true, name: fileName, bytes } : { ok: false, reason: 'size' };
};

export { romCandidate };
