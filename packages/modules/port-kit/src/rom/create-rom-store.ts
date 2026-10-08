/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { PortDefinition } from '../port/port-definition.type';
import type { RomIdentity, StoredRom } from './rom.type';
import type { RomImport, RomStore } from './rom-store.type';
import { ASSETS_DIR, ROMS_DIR } from './rom-files.constants';
import { hasRomExtension } from './has-rom-extension';
import { identifyRom } from './identify-rom';
import { assertRomFileName } from './assert-rom-file-name';
import { romFileNameOf } from './rom-file-name-of';

const stemOf = (file: string): string => file.replace(/\.[^.]+$/, '');

const identityOf = (definition: PortDefinition, file: string): RomIdentity | null =>
  Object.values(definition.rom.known).find((identity) => identity.id === stemOf(file)) ?? null;

const canonicalName = (definition: PortDefinition, identity: RomIdentity): string =>
  assertSafeName(`${identity.id}${definition.rom.extensions[0] ?? '.rom'}`, 'ROM file');

const createRomStore = (files: FileStore, definition: PortDefinition): RomStore => {
  const keepName = definition.rom.keepFileName === true;
  const guard = (name: string): string => (keepName ? assertRomFileName(name) : assertSafeName(name, 'ROM file'));

  const assetFileOf = (file: string): string | null =>
    definition.assets ? `${ASSETS_DIR}/${guard(stemOf(file))}${definition.assets.extension}` : null;

  const importRom = async (fileName: string, bytes: Uint8Array): Promise<RomImport> => {
    if (!hasRomExtension(fileName, definition.rom)) return { ok: false, hash: '', reason: 'extension' };
    const check = await identifyRom(bytes, definition.rom);
    if (!check.ok) return check;
    const file = keepName ? romFileNameOf(fileName) : canonicalName(definition, check.rom.identity);
    await files.mkdir(ROMS_DIR);
    await files.writeBytes(`${ROMS_DIR}/${file}`, check.rom.bytes);
    return { ...check, file };
  };

  const hasAssets = (file: string): Promise<boolean> => {
    const asset = assetFileOf(file);
    return asset ? files.exists(asset) : Promise.resolve(false);
  };

  const read = async (file: string) => {
    const bytes = await files.readBytes(`${ROMS_DIR}/${guard(file)}`);
    return bytes ? identifyRom(bytes, definition.rom) : null;
  };

  const identifyStored = async (file: string): Promise<Omit<StoredRom, 'hasAssets'> | null> => {
    if (!keepName) {
      const identity = identityOf(definition, file);
      return identity ? { file, identity } : null;
    }
    if (!hasRomExtension(file, definition.rom)) return null;
    const check = await read(file).catch(() => null);
    return check?.ok ? { file, identity: check.rom.identity } : null;
  };

  const list = async (): Promise<StoredRom[]> => {
    const found = await Promise.all((await files.list(ROMS_DIR)).map(identifyStored));
    const known = found.filter((entry) => entry !== null);
    return Promise.all(known.map(async (entry) => ({ ...entry, hasAssets: await hasAssets(entry.file) })));
  };

  const remove = async (file: string): Promise<void> => {
    await files.remove(`${ROMS_DIR}/${guard(file)}`);
    const asset = assetFileOf(file);
    if (asset) await files.remove(asset);
  };

  return { importRom, list, read, remove, assetFileOf };
};

export { createRomStore };
