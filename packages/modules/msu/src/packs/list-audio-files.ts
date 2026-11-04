/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import { isAudioFile, packDir } from '../paths';
import type { MsuPackFile } from './msu.type';

const listAudioFiles = async (config: MsuGameConfig, files: FileStore, pack: string): Promise<MsuPackFile[]> => {
  const out: MsuPackFile[] = [];
  for (const f of (await files.list(packDir(config, pack))).filter(isAudioFile)) {
    const st = await files.stat(`${packDir(config, pack)}/${f}`);
    if (st && !st.isDirectory) out.push({ name: f, size: st.bytes });
  }
  return out;
};

export { listAudioFiles };
