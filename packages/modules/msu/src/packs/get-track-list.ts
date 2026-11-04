/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { packDir, trackNumberOf } from '../paths';
import { extensionOf } from './extension-of';
import type { MsuTrackFile } from './msu.type';

const getTrackList = async (config: MsuGameConfig, files: FileStore, pack: string): Promise<MsuTrackFile[]> => {
  const out: MsuTrackFile[] = [];
  for (const f of await files.list(packDir(config, pack))) {
    const trackNum = trackNumberOf(f);
    if (trackNum !== null) out.push({ fileName: f, trackNum, ext: extensionOf(f) });
  }
  return out;
};

export { getTrackList };
