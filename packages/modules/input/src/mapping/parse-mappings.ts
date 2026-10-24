/* @layer core @kind logic */
import type { MappingEntry } from './mapping-entry.type';
import type { SourceOf } from './parse-mappings.type';
import { parseMapping } from './parse-mapping';

const parseMappings = (lines: readonly string[], sourceOf?: SourceOf): MappingEntry[] => {
  const byKey = new Map<string, MappingEntry>();
  for (const line of lines) {
    const entry = parseMapping(line);
    if (!entry) continue;
    entry.source = sourceOf?.(entry.guid, entry.platform) ?? entry.source;
    byKey.set(`${entry.guid}|${entry.platform ?? ''}`, entry);
  }
  return [...byKey.values()];
};

export { parseMappings };
