/* @layer core @kind types */
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface PlacementSphere<W extends World = World> {
  index: number;
  locations: KeysOf<W>['location'][];
}

export type { PlacementSphere };
