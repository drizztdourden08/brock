/* @layer renderer-shell @kind logic */
import { groupsOf } from './groups-of';
import type { WindowDef } from './window.type';

const problemsOf = (def: WindowDef): string[] => {
  const items = groupsOf(def).flatMap((group) => group.items);
  const ids = items.map((item) => item.id);
  const repeated = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  return [
    ...(items.length === 0 ? ['it declares no nav items'] : []),
    ...repeated.map((id) => `the nav item "${id}" is declared twice`),
    ...(items.length > 0 && items.every((item) => item.disabled === true) ? ['every nav item is disabled'] : []),
    ...(def.initial === undefined || ids.includes(def.initial) ? [] : [`initial "${def.initial}" is not a nav item`]),
  ];
};

const assertWindow = (def: WindowDef): void => {
  const problems = problemsOf(def);
  if (problems.length > 0) throw new Error(`defineWindow: ${problems.join('; ')}.`);
};

export { assertWindow };
