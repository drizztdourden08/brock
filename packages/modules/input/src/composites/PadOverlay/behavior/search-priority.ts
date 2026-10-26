/* @layer renderer-components @kind logic */
import { PRIORITY_BUDGET } from '../PadOverlay.constants';
import { bestCombination } from './best-combination';
import { optionsCompatible } from './options-compatible';
import type { Choice, LabelOption } from './placement.type';
import { searchLabels } from './search-labels';

const searchPriority = (options: readonly LabelOption[][], first: readonly number[]): Choice[] | null => {
  if (first.length === 0) return null;
  const picks = bestCombination(first.map((index) => options[index] ?? []), Infinity, PRIORITY_BUDGET);
  if (!picks) return null;
  const rest = options.map((domain, index) => {
    const at = first.indexOf(index);
    return at >= 0 ? domain.filter((option) => option === picks[at]) : domain.filter((option) => picks.every((pick) => optionsCompatible(option, pick)));
  });
  return searchLabels(rest);
};

export { searchPriority };
