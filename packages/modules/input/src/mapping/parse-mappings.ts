/* @layer core @kind logic */
import type { MappingEntry } from './mapping-entry.type';
import { parseMapping } from './parse-mapping';

const parseMappings = (lines: readonly string[]): MappingEntry[] => {
  const byKey = new Map<string, MappingEntry>();
  for (const line of lines) {
    const entry = parseMapping(line);
    if (entry) byKey.set(`${entry.guid}|${entry.platform ?? ''}`, entry);
  }
  return [...byKey.values()];
};

export { parseMappings };
