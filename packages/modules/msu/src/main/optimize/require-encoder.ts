/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { getTools } from '@drizztdourden08/brock-tools/main';
import type { EncoderTools } from '../encoder/encoder-tools.type';
import { TOOL_MISSING } from './optimize.constants';

const requireEncoder = async (ctx: MainContext, toolId: string): Promise<EncoderTools> => {
  const tools = getTools(ctx);
  const state = await tools.state(toolId);
  if (state?.status !== 'ready') throw new Error(TOOL_MISSING);
  return { tools, toolId };
};

export { requireEncoder };
