/* @layer core @kind types */

interface StoredPlacementShape {
  schema: string;
  locations: object;
  stats: object;
  spheres: unknown[];
}

export type { StoredPlacementShape };
