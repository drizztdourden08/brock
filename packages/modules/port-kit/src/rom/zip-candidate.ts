/* @layer core @kind logic */
import type { RomRules } from './rom.type';
import type { RomCandidate, ZipEntryCheck } from './rom-store.type';
import type { ZipEntry } from './zip/zip-read.type';
import { hasRomExtension } from './has-rom-extension';
import { identifyRom } from './identify-rom';
import { readZipEntries } from './zip/read-zip-entries';

const fits = (size: number, rules: RomRules): boolean => size > 0 && (rules.maxBytes === undefined || size <= rules.maxBytes);

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const checkEntry = async (entry: ZipEntry, rules: RomRules): Promise<ZipEntryCheck> => {
  if (!hasRomExtension(entry.name, rules)) return { entry, note: 'not a ROM file' };
  if (!fits(entry.size, rules)) return { entry, note: entry.size > 0 ? 'too large' : 'empty' };
  const bytes = await entry.read();
  const known = (await identifyRom(bytes, { ...rules, acceptUnknown: false })).ok;
  return { entry, note: known ? 'known dump' : 'unknown dump', bytes, known };
};

const refusal = (checked: ZipEntryCheck[]): RomCandidate => {
  const held = checked.map(({ entry, note }) => `${entry.name} (${note})`).join(', ');
  return { ok: false, reason: 'archive', message: checked.length === 0 ? 'The zip holds no files.' : `The zip holds no single dump to import: ${held}.` };
};

const pick = (checked: ZipEntryCheck[], rules: RomRules): ZipEntryCheck | null => {
  const known = checked.filter((item) => item.known === true);
  if (known.length === 1) return known[0] ?? null;
  const romLike = checked.filter((item) => item.bytes !== undefined);
  return known.length === 0 && rules.acceptUnknown && romLike.length === 1 ? romLike[0] ?? null : null;
};

const zipCandidate = async (bytes: Uint8Array, rules: RomRules): Promise<RomCandidate> => {
  let entries: ZipEntry[];
  try {
    entries = readZipEntries(bytes);
  } catch (error) {
    return { ok: false, reason: 'archive', message: `The zip cannot be read: ${messageOf(error)}` };
  }
  const checked = await Promise.all(entries.map((entry) => checkEntry(entry, rules)));
  const chosen = pick(checked, rules);
  return chosen?.bytes ? { ok: true, name: chosen.entry.name, bytes: chosen.bytes } : refusal(checked);
};

export { zipCandidate };
