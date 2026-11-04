/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { readManifest } from '../edit';
import { packDir } from '../paths';
import { isMsuFile } from './is-msu-file';
import type { MsuPackSummary } from './msu.type';
import { packGameMismatch } from './pack-game-mismatch';
import { packSize } from './pack-size';

const listPacks = async (config: MsuGameConfig, files: FileStore): Promise<MsuPackSummary[]> => {
  const out: MsuPackSummary[] = [];
  for (const name of await files.list(config.packRoot)) {
    const dir = packDir(config, name);
    const trackFiles = (await files.list(dir)).filter(isMsuFile);
    const manifest = await readManifest(config, files, name);
    out.push({
      name,
      fileCount: trackFiles.length,
      totalSize: await packSize(files, dir, trackFiles),
      notForThisGame: packGameMismatch(config, manifest),
    });
  }
  return out;
};

export { listPacks };
