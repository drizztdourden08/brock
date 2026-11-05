/* @layer electron-main @kind logic */
import { withLoopSampleCarried } from '../../layer-edit';
import type { MsuPackManifest } from '../../types';
import type { PackEnv } from '../pack-fs';
import { readLoopSample } from './loop-point';

const carryLoopPoints = async (
  env: PackEnv, pack: string, fileNames: string[], manifest: MsuPackManifest,
): Promise<{ manifest: MsuPackManifest; carried: number }> => {
  let working = manifest;
  let carried = 0;
  for (const name of fileNames) {
    const loopSample = await readLoopSample(env, pack, name);
    if (loopSample === null) continue;
    working = withLoopSampleCarried(working, name, loopSample);
    carried += 1;
  }
  return { manifest: working, carried };
};

export { carryLoopPoints };
