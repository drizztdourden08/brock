/* @layer core @kind logic */
import { TRUE } from '../../world';
import { claimName } from './claim-name';
import type { ApExportSource } from './export-source.type';
import type { ExportedLocation } from './export.type';
import type { World, WorldKeys, WorldLocation } from '../../world';

const idOf = <K extends WorldKeys>(source: ApExportSource<K>, location: WorldLocation<K>): number => {
  const id = source.locationIds[location.key];
  if (id === undefined) throw new Error(`location has no Archipelago id: ${location.key}`);
  return id;
};

const exportLocations = <K extends WorldKeys>(source: ApExportSource<K>, world: World<K>): ExportedLocation[] => {
  const names = new Set<string>();
  return [...world.locationsByKey.values()].map((location) => {
    const id = idOf(source, location);
    const name = source.locationNames[id];
    if (name === undefined) throw new Error(`location has no Archipelago name: ${location.key}`);
    claimName(names, name, 'locations');
    return {
      key: location.key,
      id,
      name,
      region: location.region,
      prize: source.isPrize(location),
      requires: source.requires(location),
      rule: world.getLocationRule(location.key)?.node ?? TRUE,
    };
  });
};

export { exportLocations };
