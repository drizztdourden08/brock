/* @layer core @kind types */
import type { PlacementSphere, World, WorldKeys } from '../../world';

type VanillaPlacement<K extends WorldKeys> = {
  locations: Map<K['location'], K['item']>;
  spheres: PlacementSphere<World<K>>[];
};

export type { VanillaPlacement };
