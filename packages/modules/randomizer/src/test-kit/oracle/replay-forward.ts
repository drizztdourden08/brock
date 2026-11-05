/* @layer core @kind logic */
import type { ApSpoiler } from './ap-spoiler.type';
import type { ForwardVerdict, ReplayModel } from './replay-model.type';

const known = (key: string | undefined, name: string, unknown: string[]): string | undefined => {
  if (key === undefined) unknown.push(name);
  return key;
};

const reachedIn = <S>(model: ReplayModel<S>, state: S, name: string, unknown: string[]): boolean => {
  const event = model.eventKey(name);
  if (event !== undefined) return model.reachedEvent(state, event);
  const key = known(model.locationKey(name), name, unknown);
  return key === undefined || model.reachedLocation(state, key);
};

const pairsOf = <S>(model: ReplayModel<S>, spoiler: ApSpoiler, unknown: string[]): [string, string][] => {
  const pairs: [string, string][] = [];
  for (const [location, item] of spoiler.placements) {
    if (model.eventKey(location) !== undefined) continue;
    const locationKey = known(model.locationKey(location), location, unknown);
    const itemKey = known(model.itemKey(item), item, unknown);
    if (locationKey !== undefined && itemKey !== undefined) pairs.push([locationKey, itemKey]);
  }
  return pairs;
};

const walkSpheres = <S>(model: ReplayModel<S>, spoiler: ApSpoiler, unknown: string[]): string[] => {
  const state = model.startState();
  const sphereMisses: string[] = [];
  for (const sphere of spoiler.spheres) {
    for (const [location] of sphere) {
      if (!reachedIn(model, state, location, unknown)) sphereMisses.push(location);
    }
    for (const [location, item] of sphere) {
      const itemKey = model.eventKey(location) ?? known(model.itemKey(item), item, unknown);
      if (itemKey !== undefined) model.collect(state, itemKey);
    }
  }
  return sphereMisses;
};

const replayForward = <S>(model: ReplayModel<S>, spoiler: ApSpoiler): ForwardVerdict => {
  const unknown: string[] = [];
  model.place(pairsOf(model, spoiler, unknown));
  const sphereMisses = walkSpheres(model, spoiler, unknown);
  const { beaten, unreachable } = model.sweep();
  return { unknown, sphereMisses, unreachable, beaten };
};

export { replayForward };
