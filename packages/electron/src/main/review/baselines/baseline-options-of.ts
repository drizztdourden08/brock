/* @layer electron-main @kind logic */
import { GLOBAL_STEP } from '@drizztdourden08/brock-core/review';
import type { ReviewCheck } from '@drizztdourden08/brock-core/review';
import type { MainContext } from '../../types/main-context.type';
import type { BaselineOptions } from './baseline-options.type';
import { readBaselineOptions } from './read-baseline-options';

const baselineOptionsOf = (ctx: MainContext): { options: BaselineOptions | null; problem: ReviewCheck | null } => {
  try {
    return { options: readBaselineOptions(ctx.flags), problem: null };
  } catch (err) {
    const reason = `the baselines cannot be used: ${err instanceof Error ? err.message : String(err)}`;
    return { options: null, problem: { id: 'baselines', step: GLOBAL_STEP, pass: false, reason } };
  }
};

export { baselineOptionsOf };
