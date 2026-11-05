/* @layer core @kind types */
interface TrackerFacetOption {
  id: string;
  label: string;
}

interface TrackerFacetGroup {
  id: string;
  label: string;
  options: readonly TrackerFacetOption[];
}

export type { TrackerFacetGroup, TrackerFacetOption };
