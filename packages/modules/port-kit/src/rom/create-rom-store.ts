/* @layer core @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { PortDefinition } from '../port/port-definition.type';
import type { RomKindDefinition } from './rom.type';
import type { RomKindStore, RomStore } from './rom-store.type';
import { MAIN_ROM_KIND, ROMS_DIR } from './rom-files.constants';
import { createRomKindStore } from './create-rom-kind-store';

const dirOf = (kind: string, { dir = ROMS_DIR }: RomKindDefinition): string => {
  if (kind === MAIN_ROM_KIND) throw new Error(`ROM kind "${MAIN_ROM_KIND}" is the port's own rom definition.`);
  return dir.split('/').map((segment) => assertSafeName(segment, 'ROM folder')).join('/');
};

const createRomStore = (files: FileStore, definition: PortDefinition): RomStore => {
  const { kinds = {}, ...rules } = definition.rom;
  const main = createRomKindStore(files, { kind: MAIN_ROM_KIND, rules, dir: ROMS_DIR, assetExtension: definition.assets?.extension ?? null });
  const extra = new Map<string, RomKindStore>(Object.entries(kinds).map(([kind, kindRules]) =>
    [kind, createRomKindStore(files, { kind, rules: kindRules, dir: dirOf(kind, kindRules), assetExtension: null })]));

  const of = (kind: string): RomKindStore => {
    const store = kind === MAIN_ROM_KIND ? main : extra.get(kind);
    if (!store) throw new Error(`Port "${definition.id}" declares no ROM kind "${kind}".`);
    return store;
  };

  return { ...main, kinds: () => [MAIN_ROM_KIND, ...extra.keys()], of };
};

export { createRomStore };
