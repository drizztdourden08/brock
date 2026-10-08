/* @layer electron-main @kind logic */
import { resolveBaselineRule } from '@drizztdourden08/brock-core/review';
import { composeCapture } from '../../widgets/compose-capture';
import type { BaselineOptions } from './baseline-options.type';
import { prepareGroupCapture } from './prepare-group-capture';
import { untilStable } from './until-stable';

const stableGroupCapture = async (options: BaselineOptions): Promise<Buffer | null> => {
  const restore = await prepareGroupCapture(resolveBaselineRule(options.config, '').selectors);
  try {
    return (await untilStable(composeCapture)).png;
  } finally {
    await restore();
  }
};

export { stableGroupCapture };
