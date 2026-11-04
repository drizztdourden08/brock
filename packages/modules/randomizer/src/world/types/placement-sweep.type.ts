/* @layer core @kind types */
import type { KeysOf } from './keys-of.type';
import type { PlacementSphere } from './placement-sphere.type';
import type { World } from './world.type';

interface PlacementSweep<W extends World = World> {
  spheres: PlacementSphere<W>[];
  collected: Set<KeysOf<W>['location']>;
  uncollected: KeysOf<W>['location'][];
  missedEvents: KeysOf<W>['event'][];
  beaten: boolean;
}

export type { PlacementSweep };
