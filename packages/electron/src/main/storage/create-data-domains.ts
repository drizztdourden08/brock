/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import type { DataDomainDef, DomainUsage } from '@drizztdourden08/brock-core/platform';
import { createDomainFiles } from './create-domain-files';
import type { DataDomains, DomainFiles } from './domain-files.type';
import { resolveInside } from './resolve-inside';
import { walkFiles } from './walk-files';

const countEntries = async (dir: string): Promise<number> => {
  try {
    return (await readdir(dir)).length;
  } catch {
    return 0;
  }
};

const assertDefs = (defs: readonly DataDomainDef[]): void => {
  const seen = new Set<string>();
  for (const def of defs) {
    if (seen.has(def.domain)) throw new Error(`data domain "${def.domain}" is declared twice`);
    if (def.dir.trim() === '' || def.dir === '.') throw new Error(`data domain "${def.domain}" needs a folder of its own under Data/`);
    resolveInside('/data', def.dir);
    seen.add(def.domain);
  }
};

const createDataDomains = (defs: readonly DataDomainDef[], dataPath: (dir: string) => string): DataDomains => {
  assertDefs(defs);
  const byId = new Map(defs.map((def) => [def.domain, def]));
  const files = new Map<string, DomainFiles>();
  const def = (domain: string): DataDomainDef => {
    const found = byId.get(domain);
    if (!found) throw new Error(`unknown data domain: ${domain}`);
    return found;
  };
  const filesOf = (domain: string): DomainFiles => {
    const { dir } = def(domain);
    const known = files.get(domain) ?? createDomainFiles(domain, () => dataPath(dir));
    files.set(domain, known);
    return known;
  };
  const usage = async (domain: string): Promise<DomainUsage> => {
    const { label, dir } = def(domain);
    const root = dataPath(dir);
    const [count, walked] = await Promise.all([countEntries(root), walkFiles(root)]);
    return { domain, label, count, bytes: walked.reduce((sum, file) => sum + file.bytes, 0) };
  };
  return { list: () => [...defs], def, domain: filesOf, usage };
};

export { createDataDomains };
