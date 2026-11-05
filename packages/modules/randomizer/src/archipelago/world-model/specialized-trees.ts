/* @layer core @kind logic */
import { specializeRuleNode } from '../export';
import type { ModelFillWorld, WorldModelHooks } from './world-model.type';
import type { RuleNode, WorldKeys } from '../../world';

const specializedTrees = <K extends WorldKeys>(
  fillWorld: ModelFillWorld<K>, hooks: WorldModelHooks<K>,
): RuleNode<K>[] => {
  const { world } = fillWorld;
  const readings = hooks.readings(world);
  const reader = {
    option: (key: string) => {
      const value = readings[key];
      if (value === undefined) throw new Error(`rule reads an option the hooks do not report: ${key}`);
      return value;
    },
    seed: (key: string) => {
      const value = world.seedValues.get(key);
      if (value === undefined) throw new Error(`seed table has no value: ${key}`);
      return value;
    },
  };
  const roots = [...world.locationRules.values(), ...world.eventRules.values(), ...world.rules.values()]
    .map((rule) => rule.node);
  return roots.map((node) => specializeRuleNode(node, world, reader, hooks.helpers));
};

export { specializedTrees };
