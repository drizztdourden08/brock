/* @layer core @kind types */
import type { PlacementSphere, World, WorldKeys } from '../types';

interface DefPlacement<K extends WorldKeys = WorldKeys> {
  seed: string;
  attempts: number;
  locations: [K['location'], K['item']][];
  spheres: PlacementSphere<World<K>>[];
}

export type { DefPlacement };
