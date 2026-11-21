/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface TrackerGrouping {
  id: string;
  label: Text;
  description?: Text;
}

export type { TrackerGrouping };
