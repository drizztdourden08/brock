/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { msuMainOptionsOf } from '../msu-main-options-of';
import { refuseWrite } from '../pack-fs';
import { analyzePack } from './analyze';
import { optimizeEnvOf } from './optimize-env-of';
import { convertPack } from './run';

const registerOptimizeHandlers = (ctx: MainContext): void => {
  ctx.handle('msu:optimize:measure', async (_event, packName) => analyzePack(await optimizeEnvOf(ctx), packName));

  ctx.handle('msu:optimize:convert', async (_event, packName, fileNames) => {
    await refuseWrite(msuMainOptionsOf(ctx).refuseWrite, packName);
    return convertPack(await optimizeEnvOf(ctx), packName, fileNames);
  });
};

export { registerOptimizeHandlers };
