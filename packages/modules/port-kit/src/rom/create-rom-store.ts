/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { PortDefinition } from '../port/port-definition.type';
import type { RomIdentity, StoredRom } from './rom.type';
import type { RomImport, RomStore } from './rom-store.type';
import { ASSETS_DIR, ROMS_DIR } from './rom-files.constants';
import { hasRomExtension } from './has-rom-extension';
import { identifyRom } from './identify-rom';

const stemOf = (file: string): string => file.replace(/\.[^.]+$/, '');

const identityOf = (definition: PortDefinition, file: string): RomIdentity | null =>
  Object.values(definition.rom.known).find((identity) => identity.id === stemOf(file)) ?? null;

const canonicalName = (definition: PortDefinition, identity: RomIdentity): string =>
  assertSafeName(`${identity.id}${definition.rom.extensions[0] ?? '.rom'}`, 'ROM file');

const createRomStore = (files: FileStore, definition: PortDefinition): RomStore => {
  const assetFileOf = (file: string): string | null =>
    definition.assets ? `${ASSETS_DIR}/${assertSafeName(stemOf(file), 'ROM file')}${definition.assets.extension}` : null;

  const importRom = async (fileName: string, bytes: Uint8Array): Promise<RomImport> => {
    if (!hasRomExtension(fileName, definition.rom)) return { ok: false, hash: '', reason: 'extension' };
    const check = await identifyRom(bytes, definition.rom);
    if (!check.ok) return check;
    const file = canonicalName(definition, check.rom.identity);
    await files.mkdir(ROMS_DIR);
    await files.writeBytes(`${ROMS_DIR}/${file}`, check.rom.bytes);
    return { ...check, file };
  };

  const hasAssets = (file: string): Promise<boolean> => {
    const asset = assetFileOf(file);
    return asset ? files.exists(asset) : Promise.resolve(false);
  };

  const list = async (): Promise<StoredRom[]> => {
    const names = await files.list(ROMS_DIR);
    const known = names
      .map((file) => ({ file, identity: identityOf(definition, file) }))
      .filter((entry): entry is { file: string; identity: RomIdentity } => entry.identity !== null);
    return Promise.all(known.map(async (entry) => ({ ...entry, hasAssets: await hasAssets(entry.file) })));
  };

  const read = async (file: string) => {
    const bytes = await files.readBytes(`${ROMS_DIR}/${assertSafeName(file, 'ROM file')}`);
    return bytes ? identifyRom(bytes, definition.rom) : null;
  };

  const remove = async (file: string): Promise<void> => {
    await files.remove(`${ROMS_DIR}/${assertSafeName(file, 'ROM file')}`);
    const asset = assetFileOf(file);
    if (asset) await files.remove(asset);
  };

  return { importRom, list, read, remove, assetFileOf };
};

export { createRomStore };
