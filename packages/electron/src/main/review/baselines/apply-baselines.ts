/* @layer electron-main @kind logic */
import type { BaselineReport } from '@drizztdourden08/brock-core/review';
import type { BaselineOptions, BaselineRunInput } from './baseline-options.type';
import { blessBaselines } from './bless-baselines';
import { compareBaselines } from './compare-baselines';

const applyBaselines = (options: BaselineOptions, input: BaselineRunInput): Promise<BaselineReport> =>
  (options.mode === 'bless' ? blessBaselines(options, input) : compareBaselines(options, input));

export { applyBaselines };
