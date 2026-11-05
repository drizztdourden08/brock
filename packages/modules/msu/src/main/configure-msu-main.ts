/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { getTools } from '@drizztdourden08/brock-tools/main';
import { ffmpegTool } from './encoder/ffmpeg-tool';
import { DEFAULT_ENCODER_TOOL_ID } from './msu-main.constants';
import type { MsuMainOptions } from './msu-main-options.type';
import { msuMainState } from './msu-main-state';

const configureMsuMain = (ctx: MainContext, options: MsuMainOptions): void => {
  msuMainState(ctx).options = options;
  if (options.registerTool === false) return;
  getTools(ctx).register(ffmpegTool(process.platform, options.toolId ?? DEFAULT_ENCODER_TOOL_ID));
};

export { configureMsuMain };
