/* @layer renderer-shell @kind logic */
import { rungFrom } from './rung-from';
import type { NudgeParams } from '../NumberSetter.type';

const nudgeTarget = ({ ladder, steps, value, dir }: NudgeParams): number | null => {
  if (ladder) return rungFrom(ladder, value, dir);
  const [step] = steps;
  return step === undefined ? null : value + dir * step;
};

export { nudgeTarget };
