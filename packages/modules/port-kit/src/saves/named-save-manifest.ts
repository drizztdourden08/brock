/* @layer core @kind logic */
import { readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { NamedSaveEntry, NamedSaveKind } from './save-slot.type';
import type { NamedSaveManifest } from './save-store.type';
import { MANIFEST_FILE } from './save-slot.constants';
import { savesDirOf } from './saves-dir-of';

const namedSaveManifest = (files: FileStore, profileId: string, kind: NamedSaveKind): NamedSaveManifest => {
  const dir = savesDirOf(profileId, kind);
  const path = `${dir}/${MANIFEST_FILE}`;
  return {
    read: () => readJson<NamedSaveEntry[]>(files, path, []),
    write: async (entries) => {
      await files.mkdir(dir);
      await writeJson(files, path, entries, { trailingNewline: true });
    },
  };
};

export { namedSaveManifest };
