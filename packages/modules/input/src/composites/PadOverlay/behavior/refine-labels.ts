/* @layer renderer-components @kind logic */
import { REFINE_EJECT, REFINE_PASSES } from '../PadOverlay.constants';
import { optionsCompatible } from './options-compatible';
import type { LabelOption } from './placement.type';

const costOf = (option: LabelOption | undefined): number => option?.cost ?? 0;

const cheaperAlternative = (domain: readonly LabelOption[], held: readonly LabelOption[]): LabelOption | null =>
  domain.find((option) => held.every((other) => optionsCompatible(option, other))) ?? null;

const improved = (
  index: number, option: LabelOption, options: readonly LabelOption[][], chosen: readonly LabelOption[],
): LabelOption[] | null => {
  const others = chosen.map((pick, at) => ({ pick, at })).filter(({ at }) => at !== index);
  const evicted = others.filter(({ pick }) => !optionsCompatible(option, pick));
  if (evicted.length > REFINE_EJECT) return null;
  const next = [...chosen];
  next[index] = option;
  const kept = others.filter((entry) => !evicted.includes(entry)).map(({ pick }) => pick);
  const held = [option, ...kept];
  for (const { at } of evicted) {
    const alternative = cheaperAlternative(options[at] ?? [], held);
    if (!alternative) return null;
    next[at] = alternative;
    held.push(alternative);
  }
  const before = chosen.reduce((sum, pick) => sum + pick.cost, 0);
  return next.reduce((sum, pick) => sum + pick.cost, 0) < before ? next : null;
};

const improveOne = (index: number, options: readonly LabelOption[][], chosen: readonly LabelOption[]): LabelOption[] | null => {
  const current = costOf(chosen[index]);
  for (const option of options[index] ?? []) {
    if (option.cost >= current) break;
    const next = improved(index, option, options, chosen);
    if (next) return next;
  }
  return null;
};

const refineLabels = (options: readonly LabelOption[][], start: readonly LabelOption[]): LabelOption[] => {
  let chosen = [...start];
  for (let pass = 0; pass < REFINE_PASSES; pass += 1) {
    const order = chosen.map((_, index) => index).sort((a, b) => costOf(chosen[b]) - costOf(chosen[a]));
    let changed = false;
    for (const index of order) {
      const next = improveOne(index, options, chosen);
      if (next) {
        chosen = next;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return chosen;
};

export { refineLabels };
