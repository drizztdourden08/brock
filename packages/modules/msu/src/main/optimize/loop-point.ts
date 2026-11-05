/* @layer electron-main @kind logic */
import { readMsu1LoopSample } from '../../packs';
import type { PackEnv } from '../pack-fs';

const readLoopSample = async (env: PackEnv, pack: string, fileName: string): Promise<number | null> => {
  const sample = await readMsu1LoopSample(env.game, env.files, pack, fileName);
  return sample !== null && sample > 0 ? sample : null;
};

export { readLoopSample };
