/* @layer electron-main @kind logic */
import type { VelopackAsset } from 'velopack';
import type { PlanInput, UpdatePlan } from './update-plan.type';
import { compareVersions } from './compare-versions';
import { MAX_DELTAS } from './updater-main.constants';

const hopsBetween = (versions: Iterable<string>, current: string, target: string): string[] =>
  [...versions]
    .filter((v) => compareVersions(v, current) > 0 && compareVersions(v, target) <= 0)
    .sort(compareVersions);

const deltaChain = ({ target, current, full, delta }: PlanInput): VelopackAsset[] | null => {
  if (compareVersions(target, current) <= 0 || !full.has(current)) return null;
  const hops = hopsBetween(full.keys(), current, target);
  if (hops.length === 0 || hops.length > MAX_DELTAS) return null;
  const chain = hops.map((v) => delta.get(v));
  return chain.every((d): d is VelopackAsset => d !== undefined) ? chain : null;
};

const planUpdate = (input: PlanInput): UpdatePlan | null => {
  const targetAsset = input.full.get(input.target);
  if (!targetAsset) return null;
  const chain = deltaChain(input);
  if (!chain) return { target: targetAsset, deltas: [], downloadSize: targetAsset.Size };
  return {
    target: targetAsset,
    base: input.full.get(input.current),
    deltas: chain,
    downloadSize: chain.reduce((sum, d) => sum + d.Size, 0),
  };
};

export { planUpdate };
