/* @layer electron-main @kind logic */
import { existsSync } from 'node:fs';
import type { MappingDb, MappingDbInput } from './mapping-db.type';
import { bundledDbCandidates } from './bundled-db-candidates';
import { isMappingLine } from './is-mapping-line';
import { USER_DB_PATH } from './mapping-db.constants';

const createMappingDb = ({ addon, files, paths, log, bundledPath }: MappingDbInput): MappingDb => {
  const load = async (): Promise<void> => {
    const bundled = bundledDbCandidates(bundledPath).find((candidate) => existsSync(candidate));
    if (bundled) log(`input: ${addon.addMappingsFromFile(bundled)} mappings from ${bundled}`);
    else log('input: no bundled mapping database found', 'warn');
    if (await files.exists(USER_DB_PATH)) {
      const userPath = paths.data(USER_DB_PATH);
      log(`input: ${addon.addMappingsFromFile(userPath)} mappings from ${userPath}`);
    }
  };

  const add = async (mapping: string): Promise<boolean> => {
    const line = mapping.trim();
    if (!isMappingLine(line) || !addon.addMapping(line)) return false;
    const existing = (await files.readText(USER_DB_PATH)) ?? '';
    const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
    await files.writeText(USER_DB_PATH, `${existing}${separator}${line}\n`);
    return true;
  };

  return { load, add, forGuid: addon.mappingForGuid };
};

export { createMappingDb };
