/* @layer core @kind logic */
import { helperCallsOf } from './helper-calls';
import type { ApExportSource } from './export-source.type';
import type { ExportedRules } from './export.type';
import type { World, WorldKeys } from '../../world';

const exportRules = <K extends WorldKeys>(source: ApExportSource<K>, world: World<K>): ExportedRules => {
  const roots = [...world.locationRules.values(), ...world.eventRules.values(), ...world.rules.values()]
    .map((rule) => rule.node);
  return {
    primitives: Object.fromEntries(source.primitives.map((definition) => [definition.name, definition.params])),
    helpers: helperCallsOf(world, roots, source.helpers),
  };
};

export { exportRules };
