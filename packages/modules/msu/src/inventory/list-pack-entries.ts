/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packDir } from '../paths';
import { isInventoryName } from './is-inventory-name';
import { sortInventory } from './sort-inventory';

const listPackEntries = async (config: MsuGameConfig, files: FileStore, pack: string): Promise<string[]> => {
  const dir = packDir(config, pack);
  const out: string[] = [];
  for (const name of await files.list(dir)) {
    if (!isInventoryName(name)) continue;
    const st = await files.stat(`${dir}/${name}`);
    if (st && !st.isDirectory) out.push(name);
  }
  return sortInventory(out);
};

export { listPackEntries };
