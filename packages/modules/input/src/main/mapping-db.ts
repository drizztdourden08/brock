/* @layer electron-main @kind logic */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { MappingDb, MappingDbInput } from './mapping-db.type';
import { bundledDbCandidates } from './bundled-db-candidates';
import { isMappingLine } from '../mapping/is-mapping-line';
import { guidsOfFile } from '../mapping/mapping-sources';
import { parseMapping } from '../mapping/parse-mapping';
import { parseMappings } from '../mapping/parse-mappings';
import type { MappingEntry, MappingSource } from '../mapping/mapping-entry.type';
import { USER_DB_PATH } from '../mapping/mapping-db.constants';

const createMappingDb = ({ addon, files, paths, log, bundledPath }: MappingDbInput): MappingDb => {
  let cached: MappingEntry[] | null = null;
  let bundledGuids = new Set<string>();
  let userGuids = new Set<string>();

  const load = async (): Promise<void> => {
    const bundled = bundledDbCandidates(bundledPath).find((candidate) => existsSync(candidate));
    if (bundled) {
      log(`input: ${addon.addMappingsFromFile(bundled)} mappings from ${bundled}`);
      bundledGuids = guidsOfFile(await readFile(bundled, 'utf8').catch(() => null), process.platform);
    } else log('input: no bundled mapping database found', 'warn');
    if (await files.exists(USER_DB_PATH)) {
      const userPath = paths.data(USER_DB_PATH);
      log(`input: ${addon.addMappingsFromFile(userPath)} mappings from ${userPath}`);
      userGuids = guidsOfFile(await files.readText(USER_DB_PATH), process.platform);
    }
    cached = null;
  };

  const add = async (mapping: string): Promise<boolean> => {
    const line = mapping.trim();
    if (!isMappingLine(line) || !addon.addMapping(line)) return false;
    const guid = parseMapping(line)?.guid;
    if (guid) userGuids.add(guid);
    cached = null;
    const existing = (await files.readText(USER_DB_PATH)) ?? '';
    const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
    await files.writeText(USER_DB_PATH, `${existing}${separator}${line}\n`);
    return true;
  };

  const sourceOf = (guid: string): MappingSource => {
    if (userGuids.has(guid)) return 'user';
    return bundledGuids.has(guid) ? 'bundled' : 'builtin';
  };

  const list = (): MappingEntry[] => {
    if (cached) return cached;
    const entries = parseMappings(addon.mappingList?.() ?? [], sourceOf);
    if (entries.length > 0) cached = entries;
    return entries;
  };

  return { load, add, list, forGuid: addon.mappingForGuid };
};

export { createMappingDb };
