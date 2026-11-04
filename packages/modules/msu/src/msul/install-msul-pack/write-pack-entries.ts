/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { ArchiveEntry } from '../../archive';
import type { MsuGameConfig } from '../../config';
import { writeTrackFile } from '../../edit';
import type { PackEntries } from './install-msul-pack.type';

const writePackEntries = async (
  config: MsuGameConfig, store: FileStore, pack: string, source: PackEntries,
): Promise<Set<string>> => {
  const written = new Set<string>();
  let done = 0;
  for (const entry of source.entries) {
    const name = entry.name.split('/').pop() ?? '';
    if (name && !written.has(name)) {
      await writeTrackFile(config, store, pack, { name, bytes: entry.bytes });
      written.add(name);
    }
    done += 1;
    source.onProgress?.(done, source.entries.length);
  }
  return written;
};

export { writePackEntries };
