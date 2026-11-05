/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { resolveDataPath } from '@drizztdourden08/brock-electron/main';
import { getTools } from '@drizztdourden08/brock-tools/main';
import { probeFile } from '../encoder/probe-file';
import { msuMainOptionsOf } from '../msu-main-options-of';

const registerAudioProbeHandler = (ctx: MainContext): void => {
  ctx.handle('msu:audio:probe', (_event, dataPath) => {
    const { toolId } = msuMainOptionsOf(ctx);
    return probeFile({ tools: getTools(ctx), toolId }, resolveDataPath(dataPath));
  });
};

export { registerAudioProbeHandler };
