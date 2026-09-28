/* @layer core @kind logic */
import { newId, readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { NamedSaveEntry, NamedSaveKind } from './save-slot.type';
import type { NamedSaveStore, SlotStore, SlotWrite } from './save-store.type';
import { MANIFEST_FILE } from './save-slot.constants';
import { savesDirOf } from './saves-dir-of';

const createNamedSaveStore = (files: FileStore, slots: SlotStore): NamedSaveStore => {
  const manifestOf = (profileId: string, kind: NamedSaveKind): string => `${savesDirOf(profileId, kind)}/${MANIFEST_FILE}`;

  const list = (profileId: string, kind: NamedSaveKind): Promise<NamedSaveEntry[]> =>
    readJson<NamedSaveEntry[]>(files, manifestOf(profileId, kind), []);

  const writeList = async (profileId: string, kind: NamedSaveKind, entries: NamedSaveEntry[]): Promise<void> => {
    await files.mkdir(savesDirOf(profileId, kind));
    await writeJson(files, manifestOf(profileId, kind), entries, { trailingNewline: true });
  };

  const create = async (profileId: string, kind: NamedSaveKind, name: string, data: SlotWrite): Promise<NamedSaveEntry> => {
    const entry: NamedSaveEntry = { id: newId(), name: name.trim(), savedAt: Date.now(), hasScreenshot: Boolean(data.screenshot) };
    await slots.write(profileId, { kind, id: entry.id }, data);
    await writeList(profileId, kind, [...(await list(profileId, kind)), entry]);
    return entry;
  };

  const find = async (profileId: string, kind: NamedSaveKind, name: string): Promise<NamedSaveEntry | null> => {
    const wanted = name.trim().toLowerCase();
    const matches = (await list(profileId, kind)).filter((entry) => entry.name.toLowerCase() === wanted);
    return matches.sort((a, b) => b.savedAt - a.savedAt)[0] ?? null;
  };

  const remove = async (profileId: string, kind: NamedSaveKind, id: string): Promise<void> => {
    await slots.remove(profileId, { kind, id });
    await writeList(profileId, kind, (await list(profileId, kind)).filter((entry) => entry.id !== id));
  };

  return { create, list, find, remove };
};

export { createNamedSaveStore };
