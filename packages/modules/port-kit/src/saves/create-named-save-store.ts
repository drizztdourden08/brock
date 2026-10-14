/* @layer core @kind logic */
import { newId } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { NamedSaveEntry, NamedSaveInfo, NamedSaveKind } from './save-slot.type';
import type { NamedSaveStore, NamedSaveWrite, SlotStore } from './save-store.type';
import { namedSaveManifest } from './named-save-manifest';
import { prunedEntries } from './pruned-entries';

const nameOf = (name: string): string => {
  const trimmed = name.trim();
  if (trimmed.length === 0) throw new Error('A named save needs a name.');
  return trimmed;
};

const stamp = (data: NamedSaveWrite): Pick<NamedSaveEntry, 'savedAt' | 'hasScreenshot' | 'meta'> =>
  ({ savedAt: Date.now(), hasScreenshot: Boolean(data.screenshot), ...(data.meta ? { meta: data.meta } : {}) });

const createNamedSaveStore = (files: FileStore, slots: SlotStore): NamedSaveStore => {
  const manifest = (profileId: string, kind: NamedSaveKind) => namedSaveManifest(files, profileId, kind);
  const list = (profileId: string, kind: NamedSaveKind): Promise<NamedSaveEntry[]> => manifest(profileId, kind).read();

  const update = async (profileId: string, kind: NamedSaveKind, id: string, change: (entry: NamedSaveEntry) => NamedSaveEntry): Promise<NamedSaveEntry | null> => {
    const entries = await list(profileId, kind);
    const current = entries.find((entry) => entry.id === id);
    if (!current) return null;
    const next = change(current);
    await manifest(profileId, kind).write(entries.map((entry) => (entry.id === id ? next : entry)));
    return next;
  };

  const create = async (profileId: string, kind: NamedSaveKind, name: string, data: NamedSaveWrite): Promise<NamedSaveEntry> => {
    const entry: NamedSaveEntry = { id: newId(), name: nameOf(name), ...stamp(data) };
    await slots.write(profileId, { kind, id: entry.id }, data);
    await manifest(profileId, kind).write([...(await list(profileId, kind)), entry]);
    return entry;
  };

  const overwrite = async (profileId: string, kind: NamedSaveKind, id: string, data: NamedSaveWrite): Promise<NamedSaveEntry | null> => {
    if (!(await list(profileId, kind)).some((entry) => entry.id === id)) return null;
    await slots.write(profileId, { kind, id }, data);
    return update(profileId, kind, id, (entry) => ({ ...entry, ...stamp(data) }));
  };

  const find = async (profileId: string, kind: NamedSaveKind, name: string): Promise<NamedSaveEntry | null> => {
    const wanted = name.trim().toLowerCase();
    const matches = (await list(profileId, kind)).filter((entry) => entry.name.toLowerCase() === wanted);
    return matches.sort((a, b) => b.savedAt - a.savedAt)[0] ?? null;
  };

  const remove = async (profileId: string, kind: NamedSaveKind, id: string): Promise<void> => {
    await slots.remove(profileId, { kind, id });
    await manifest(profileId, kind).write((await list(profileId, kind)).filter((entry) => entry.id !== id));
  };

  const details = async (profileId: string, kind: NamedSaveKind): Promise<NamedSaveInfo[]> => {
    const sized = await Promise.all((await list(profileId, kind)).map(async (entry) => ({ entry, bytes: await slots.bytesOf(profileId, { kind, id: entry.id }) })));
    return sized.flatMap(({ entry, bytes }) => (bytes === null ? [] : [{ ...entry, bytes }])).sort((a, b) => b.savedAt - a.savedAt);
  };

  return {
    create, list, details, find, overwrite, remove,
    rename: (profileId, kind, id, name) => update(profileId, kind, id, (entry) => ({ ...entry, name: nameOf(name) })),
    size: async (profileId, kind) => (await details(profileId, kind)).reduce((sum, info) => sum + info.bytes, 0),
    prune: async (profileId, kind, rules) => {
      const doomed = prunedEntries(await list(profileId, kind), rules);
      for (const entry of doomed) await remove(profileId, kind, entry.id);
      return doomed;
    },
  };
};

export { createNamedSaveStore };
