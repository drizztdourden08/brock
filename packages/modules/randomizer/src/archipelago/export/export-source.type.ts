/* @layer core @kind types */
import type { HelperRegistry, KeysOf, World, WorldLocation } from '../../world';
import type { ApOptionDef, ItemClass, LocationRequires } from './export.type';

interface ApExportSource<W extends World> {
  game: string;
  worldVersion: string;
  goalEvent: string;
  world: () => W;
  helpers: HelperRegistry<W>;
  primitives: readonly { name: string; params: readonly string[] }[];
  locationIds: Readonly<Record<string, number>>;
  locationNames: Readonly<Record<number, string>>;
  itemIds: Readonly<Record<string, number>>;
  itemNames: Readonly<Record<number, string>>;
  itemClass: (key: string) => ItemClass;
  isPrize: (location: WorldLocation<KeysOf<W>>) => boolean;
  requires: (location: WorldLocation<KeysOf<W>>) => LocationRequires;
  eventName: (key: string) => string;
  options: readonly ApOptionDef[];
}

export type { ApExportSource };
