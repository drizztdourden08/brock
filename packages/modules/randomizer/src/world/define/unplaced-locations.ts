/* @layer core @kind logic */
import type { World, WorldKeys } from '../types';

const unplacedLocations = <K extends WorldKeys>(world: World<K>): K['location'][] =>
  [...world.locationsByKey.keys()].filter((key) => !world.placedItems.has(key));

export { unplacedLocations };
