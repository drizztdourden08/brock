/* @layer core @kind logic */
import { TRUE } from '../../world';
import type { ApExportSource } from './export-source.type';
import type { ExportedEvent, ExportedExit, ExportedRegions } from './export.type';
import type { World, WorldKeys } from '../../world';

const exitsOf = <K extends WorldKeys>(world: World<K>): ExportedExit[] =>
  [...world.regions.values()].flatMap((region) => region.exits.map((exit) => ({
    name: exit.name, from: exit.source, to: exit.target, rule: world.getRule(exit.name)?.node ?? TRUE,
  })));

const exportRegions = <K extends WorldKeys>(source: ApExportSource<K>, world: World<K>): ExportedRegions => {
  const taken = new Set([...Object.values(source.locationNames), ...Object.values(source.itemNames)]);
  const events = [...world.eventsByKey.values()].map((event): ExportedEvent => {
    const name = source.eventName(event.key);
    if (taken.has(name)) throw new Error(`story event shares a name with a location or item: ${name}`);
    return { key: event.key, name, region: event.region, rule: world.getEventRule(event.key)?.node ?? TRUE };
  });
  return {
    start: world.start,
    regions: [...world.regions.values()].map((region) => ({ id: region.id, name: region.name })),
    exits: exitsOf(world),
    events,
  };
};

export { exportRegions };
