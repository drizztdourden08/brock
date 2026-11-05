/* @layer core @kind types */
import type { HelperRegistry, World, WorldKeys, WorldLocation } from '../../world';
import type { ApOptionDef, ItemClass, LocationRequires } from './export.type';

interface ApExportSource<K extends WorldKeys = WorldKeys> {
  game: string;
  worldVersion: string;
  goalEvent: string;
  world: () => World<K>;
  helpers: HelperRegistry<World<K>>;
  primitives: readonly { name: string; params: readonly string[] }[];
  locationIds: Readonly<Record<string, number>>;
  locationNames: Readonly<Record<number, string>>;
  itemIds: Readonly<Record<string, number>>;
  itemNames: Readonly<Record<number, string>>;
  itemClass: (key: string) => ItemClass;
  isPrize: (location: WorldLocation<K>) => boolean;
  requires: (location: WorldLocation<K>) => LocationRequires;
  eventName: (key: string) => string;
  options: readonly ApOptionDef[];
}

export type { ApExportSource };
