/* @layer renderer-shell @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { isMappingLine } from '../../mapping/is-mapping-line';
import { USER_DB_PATH } from '../../mapping/mapping-db.constants';
import type { BrockInputPlugin, MappingStore } from './android-input.type';

const linesOf = (text: string | null): string[] => (text ?? '').split('\n').map((line) => line.trim()).filter(isMappingLine);

const createMappingStore = (plugin: BrockInputPlugin, files: FileStore): MappingStore => ({
  add: async (mapping) => {
    const line = mapping.trim();
    if (!isMappingLine(line)) return false;
    const { ok } = await plugin.addMapping({ mapping: line }).catch(() => ({ ok: false }));
    if (!ok) return false;
    const existing = linesOf(await files.readText(USER_DB_PATH));
    await files.writeText(USER_DB_PATH, `${[...existing, line].join('\n')}\n`);
    return true;
  },
  replay: async () => {
    for (const mapping of linesOf(await files.readText(USER_DB_PATH))) {
      await plugin.addMapping({ mapping }).catch(() => undefined);
    }
  },
});

export { createMappingStore };
