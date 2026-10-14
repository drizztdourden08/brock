/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { RomCheck, RomIdentity, StoredRom } from './rom.type';
import type { RomImport, RomKindSetup, RomKindStore } from './rom-store.type';
import { ASSETS_DIR, UNKNOWN_ROM_STEM } from './rom-files.constants';
import { hasRomExtension } from './has-rom-extension';
import { identifyRom } from './identify-rom';
import { assertRomFileName } from './assert-rom-file-name';
import { romCandidate } from './rom-candidate';
import { romFileNameOf } from './rom-file-name-of';

const stemOf = (file: string): string => file.replace(/\.[^.]+$/, '');

const createRomKindStore = (files: FileStore, { kind, rules, dir, assetExtension }: RomKindSetup): RomKindStore => {
  const keepName = rules.keepFileName === true;
  const guard = (name: string): string => (keepName ? assertRomFileName(name) : assertSafeName(name, 'ROM file'));
  const pathOf = (file: string): string => `${dir}/${guard(file)}`;
  const named = (check: RomCheck & { ok: true }, file: string): RomCheck =>
    (check.rom.unknown ? { ok: true, rom: { ...check.rom, identity: { id: check.rom.identity.id, label: stemOf(file) } } } : check);

  const assetFileOf = (file: string): string | null => (assetExtension ? `${ASSETS_DIR}/${guard(stemOf(file))}${assetExtension}` : null);

  const importRom = async (fileName: string, bytes: Uint8Array): Promise<RomImport> => {
    const candidate = await romCandidate(fileName, bytes, rules);
    if (!candidate.ok) return { ok: false, hash: '', reason: candidate.reason, ...(candidate.message ? { message: candidate.message } : {}) };
    const check = await identifyRom(candidate.bytes, rules);
    if (!check.ok) return check;
    const file = keepName ? romFileNameOf(candidate.name) : assertSafeName(`${check.rom.identity.id}${rules.extensions[0] ?? '.rom'}`, 'ROM file');
    const existed = await files.exists(pathOf(file));
    await files.mkdir(dir);
    await files.writeBytes(pathOf(file), check.rom.bytes);
    return { ...named(check, keepName ? file : candidate.name), file, existed };
  };

  const read = async (file: string): Promise<RomCheck | null> => {
    const bytes = await files.readBytes(pathOf(file));
    if (!bytes) return null;
    const check = await identifyRom(bytes, rules);
    return check.ok ? named(check, file) : check;
  };

  const knownById = (file: string): RomIdentity | null => Object.values(rules.known).find((identity) => identity.id === stemOf(file)) ?? null;

  const listedOf = async (file: string): Promise<Omit<StoredRom, 'hasAssets'> | null> => {
    if (!hasRomExtension(file, rules)) return null;
    if (!keepName) {
      const identity = knownById(file);
      if (identity) return { file, identity };
      if (!rules.acceptUnknown || !UNKNOWN_ROM_STEM.test(stemOf(file))) return null;
    }
    const check = await read(file).catch(() => null);
    if (!check?.ok) return null;
    return check.rom.unknown ? { file, identity: check.rom.identity, unknown: true, hash: check.rom.hash } : { file, identity: check.rom.identity };
  };

  const list = async (): Promise<StoredRom[]> => {
    const found = (await Promise.all((await files.list(dir)).map(listedOf))).filter((entry) => entry !== null);
    return Promise.all(found.map(async (entry) => {
      const asset = assetFileOf(entry.file);
      return { ...entry, hasAssets: asset ? await files.exists(asset) : false };
    }));
  };

  const remove = async (file: string): Promise<string[]> => {
    const asset = assetFileOf(file);
    const derived = [...(asset ? [asset] : []), ...((await rules.derived?.(file, files)) ?? [])];
    await files.remove(pathOf(file));
    for (const path of derived) await files.remove(path);
    return [pathOf(file), ...derived];
  };

  return { kind, importRom, list, read, remove, assetFileOf };
};

export { createRomKindStore };
