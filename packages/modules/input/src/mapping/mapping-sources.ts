/* @layer core @kind logic */
import { PLATFORM_NAMES } from './mapping-db.constants';
import { parseMapping } from './parse-mapping';

const guidsOfFile = (text: string | null | undefined, nodePlatform: string): Set<string> => {
  const platform = PLATFORM_NAMES[nodePlatform];
  const guids = new Set<string>();
  for (const line of (text ?? '').split(/\r?\n/)) {
    if (line.trimStart().startsWith('#')) continue;
    const entry = parseMapping(line);
    if (entry && (!entry.platform || entry.platform === platform)) guids.add(entry.guid);
  }
  return guids;
};

export { guidsOfFile };
