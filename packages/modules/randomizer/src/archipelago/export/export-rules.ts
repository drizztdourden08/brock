/* @layer core @kind logic */
import { helperCallsOf } from './helper-calls';
import type { ApExportSource } from './export-source.type';
import type { ExportedRules } from './export.type';
import type { World } from '../../world';

const exportRules = <W extends World>(source: ApExportSource<W>, world: W): ExportedRules => {
  const roots = [...world.locationRules.values(), ...world.eventRules.values(), ...world.rules.values()]
    .map((rule) => rule.node);
  return {
    primitives: Object.fromEntries(source.primitives.map((definition) => [definition.name, definition.params])),
    helpers: helperCallsOf(world, roots, source.helpers),
  };
};

export { exportRules };
