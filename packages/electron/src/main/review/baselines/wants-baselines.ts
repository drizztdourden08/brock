/* @layer electron-main @kind logic */
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import { REVIEW_FLAG } from '@drizztdourden08/brock-core/review';
import { BASELINES_FLAG, BLESS_FLAG } from './review-baselines.constants';

const wantsBaselines = (flags: AutomationFlags, argv?: readonly string[]): boolean =>
  flags.hasFlag(REVIEW_FLAG, argv) && (flags.hasFlag(BASELINES_FLAG, argv) || flags.hasFlag(BLESS_FLAG, argv));

export { wantsBaselines };
