/* @layer core @kind types */
import type { Exit } from './exit.type';
import type { WorldEvent } from './world-event.type';
import type { WorldKeys } from './world-keys.type';
import type { WorldLocation } from './world-location.type';

interface Region<K extends WorldKeys = WorldKeys> {
  id: K['region'];
  name: string;
  locations: WorldLocation<K>[];
  events: WorldEvent<K>[];
  exits: Exit<K>[];
  entrances: Exit<K>[];
  tags?: Readonly<Record<string, unknown>>;
}

export type { Region };
