/* @layer core @kind logic */
import { exportItems } from './export-items';
import { exportLocations } from './export-locations';
import { exportRegions } from './export-regions';
import { exportRules } from './export-rules';
import { exportedOptionsOf } from './exported-options-of';
import type { ApExportSource } from './export-source.type';
import type { WorldExport } from './export.type';
import type { WorldKeys } from '../../world';

const exportApWorld = <K extends WorldKeys>(source: ApExportSource<K>): WorldExport => {
  const world = source.world();
  return {
    'game.json': { game: source.game, worldVersion: source.worldVersion, goalEvent: source.goalEvent },
    'locations.json': exportLocations(source, world),
    'regions.json': exportRegions(source, world),
    'items.json': exportItems(source),
    'rules.json': exportRules(source, world),
    'options.json': exportedOptionsOf(source.options),
  };
};

export { exportApWorld };
