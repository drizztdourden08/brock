/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { msuMainOptionsOf } from '../msu-main-options-of';
import type { OptimizeEnv } from './optimize-env.type';
import { requireEncoder } from './require-encoder';

const optimizeEnvOf = async (ctx: MainContext): Promise<OptimizeEnv> => {
  const { game, toolId } = msuMainOptionsOf(ctx);
  return {
    ...(await requireEncoder(ctx, toolId)),
    game,
    files: ctx.files,
    dataPath: (relative) => ctx.paths.data(relative),
    report: (progress) => { ctx.emit('msu:optimize:step', progress); },
  };
};

export { optimizeEnvOf };
