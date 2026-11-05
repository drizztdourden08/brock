/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { DEFAULT_ENCODER_TOOL_ID, NOT_CONFIGURED } from './msu-main.constants';
import type { ResolvedMsuMainOptions } from './msu-main-options.type';
import { msuMainState } from './msu-main-state';

const msuMainOptionsOf = (ctx: MainContext): ResolvedMsuMainOptions => {
  const options = msuMainState(ctx).options;
  if (options === null) throw new Error(NOT_CONFIGURED);
  return { game: options.game, toolId: options.toolId ?? DEFAULT_ENCODER_TOOL_ID, refuseWrite: options.refuseWrite };
};

export { msuMainOptionsOf };
