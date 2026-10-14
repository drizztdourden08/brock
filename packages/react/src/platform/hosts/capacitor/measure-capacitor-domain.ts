/* @layer renderer-shell @kind logic */
import type { DataDomainDef, DomainUsage } from '@drizztdourden08/brock-core';
import { DATA_DIRECTORY } from './capacitor.constants';
import type { FilesystemPlugin, FsEntry } from './capacitor-plugins.type';

const entriesOf = async (files: FilesystemPlugin, path: string): Promise<FsEntry[]> => {
  try {
    return (await files.readdir({ path, directory: DATA_DIRECTORY })).files;
  } catch {
    return [];
  }
};

const bytesUnder = async (files: FilesystemPlugin, path: string): Promise<number> => {
  const sizes = await Promise.all((await entriesOf(files, path)).map((entry) =>
    (entry.type === 'directory' ? bytesUnder(files, `${path}/${entry.name}`) : Promise.resolve(entry.size ?? 0))));
  return sizes.reduce((sum, size) => sum + size, 0);
};

const measureCapacitorDomain = async (files: FilesystemPlugin, def: DataDomainDef): Promise<DomainUsage> => ({
  domain: def.domain,
  label: def.label,
  count: (await entriesOf(files, def.dir)).length,
  bytes: await bytesUnder(files, def.dir),
});

export { measureCapacitorDomain };
