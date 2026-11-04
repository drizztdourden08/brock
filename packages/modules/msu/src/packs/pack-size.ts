/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';

const packSize = async (files: FileStore, dir: string, names: string[]): Promise<number> => {
  let total = 0;
  for (const name of names) {
    const st = await files.stat(`${dir}/${name}`);
    if (st) total += st.bytes;
  }
  return total;
};

export { packSize };
