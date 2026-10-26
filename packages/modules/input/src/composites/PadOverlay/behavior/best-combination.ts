/* @layer renderer-components @kind logic */
import { optionsCompatible } from './options-compatible';
import type { LabelOption, Regroup } from './placement.type';

const cheapestAfter = (domains: readonly (readonly LabelOption[])[]): number[] => {
  const rest = [0];
  for (let depth = domains.length - 1; depth >= 0; depth -= 1) rest.unshift((rest[0] ?? 0) + (domains[depth]?.[0]?.cost ?? 0));
  return rest;
};

const walk = (state: Regroup, depth: number, picks: LabelOption[], cost: number): void => {
  if (depth === state.domains.length) {
    if (cost < state.best.cost) state.best = { cost, picks: [...picks] };
    return;
  }
  for (const option of state.domains[depth] ?? []) {
    if (state.budget.left <= 0 || cost + option.cost + (state.rest[depth + 1] ?? 0) >= state.best.cost) return;
    state.budget.left -= 1;
    if (!picks.every((other) => optionsCompatible(option, other))) continue;
    picks.push(option);
    walk(state, depth + 1, picks, cost + option.cost);
    picks.pop();
  }
};

const bestCombination = (domains: readonly (readonly LabelOption[])[], incumbent: number, budget: number): LabelOption[] | null => {
  const order = domains.map((_, index) => index).sort((a, b) => (domains[a]?.length ?? 0) - (domains[b]?.length ?? 0));
  const sorted = order.map((index) => domains[index] ?? []);
  const state: Regroup = { domains: sorted, rest: cheapestAfter(sorted), budget: { left: budget }, best: { cost: incumbent, picks: [] } };
  walk(state, 0, [], 0);
  if (state.best.picks.length !== domains.length) return null;
  const picks: LabelOption[] = [];
  order.forEach((index, at) => {
    const pick = state.best.picks[at];
    if (pick) picks[index] = pick;
  });
  return picks;
};

export { bestCombination };
