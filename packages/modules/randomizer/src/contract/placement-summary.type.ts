/* @layer core @kind types */
interface PlacementSummary {
  seed: string;
  rows: readonly { label: string; value: string }[];
}

export type { PlacementSummary };
