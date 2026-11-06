/* @layer core @kind logic */
import type { World, WorldKeys } from '../../world/types';
import { ruleDiff } from './rule-diff';
import { structureDiff } from './structure-diff';

const treeShapeDiff = <K extends WorldKeys>(wide: World<K>, profile: World<K>): string[] => [
  ...ruleDiff(wide.locationRules, profile.locationRules),
  ...ruleDiff(wide.rules, profile.rules),
  ...ruleDiff(wide.eventRules, profile.eventRules),
  ...structureDiff(wide, profile),
];

export { treeShapeDiff };
