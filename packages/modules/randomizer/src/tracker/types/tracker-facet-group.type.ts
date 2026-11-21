/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface TrackerFacetOption {
  id: string;
  label: Text;
}

interface TrackerFacetGroup {
  id: string;
  label: Text;
  options: readonly TrackerFacetOption[];
}

export type { TrackerFacetGroup, TrackerFacetOption };
