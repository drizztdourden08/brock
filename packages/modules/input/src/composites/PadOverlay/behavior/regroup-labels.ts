/* @layer renderer-components @kind logic */
import { REGROUP_BRANCH, REGROUP_BUDGET, REGROUP_PROBE, REGROUP_SEEDS, REGROUP_SIZE } from '../PadOverlay.constants';
import { bestCombination } from './best-combination';
import { optionsCompatible } from './options-compatible';
import type { LabelOption } from './placement.type';

const excessOf = (options: readonly LabelOption[][], chosen: readonly LabelOption[], index: number): number =>
  (chosen[index]?.cost ?? 0) - (options[index]?.[0]?.cost ?? 0);

const groupOf = (options: readonly LabelOption[][], chosen: readonly LabelOption[], skip: number): number[] => {
  const seeds = chosen.map((_, index) => index).sort((a, b) => excessOf(options, chosen, b) - excessOf(options, chosen, a))
    .slice(skip, skip + REGROUP_SEEDS).filter((index) => excessOf(options, chosen, index) > 0);
  const tally = new Map<number, number>();
  for (const seed of seeds) {
    for (const option of (options[seed] ?? []).slice(0, REGROUP_PROBE)) {
      chosen.forEach((pick, at) => {
        if (!seeds.includes(at) && !optionsCompatible(option, pick)) tally.set(at, (tally.get(at) ?? 0) + 1);
      });
    }
  }
  const neighbours = [...tally].sort((a, b) => b[1] - a[1]).slice(0, REGROUP_SIZE - seeds.length).map(([at]) => at);
  return [...seeds, ...neighbours];
};

const regroupOnce = (options: readonly LabelOption[][], chosen: readonly LabelOption[], skip: number): LabelOption[] => {
  const group = groupOf(options, chosen, skip);
  if (group.length < 2) return [...chosen];
  const fixed = chosen.filter((_, index) => !group.includes(index));
  const domains = group.map((index) => {
    const current = chosen[index];
    const spots = (options[index] ?? []).slice(0, REGROUP_BRANCH).filter((option) => fixed.every((other) => optionsCompatible(option, other)));
    return current && !spots.includes(current) ? [...spots, current].sort((a, b) => a.cost - b.cost) : spots;
  });
  const incumbent = group.reduce((sum, index) => sum + (chosen[index]?.cost ?? 0), 0) + 1e-6;
  const picks = bestCombination(domains, incumbent, REGROUP_BUDGET);
  const next = [...chosen];
  picks?.forEach((pick, at) => {
    const index = group[at];
    if (index !== undefined) next[index] = pick;
  });
  return next;
};

const regroupLabels = (options: readonly LabelOption[][], chosen: readonly LabelOption[], rounds: number): LabelOption[] => {
  let next = [...chosen];
  for (let round = 0; round < rounds; round += 1) next = regroupOnce(options, next, round);
  return next;
};

export { regroupLabels };
