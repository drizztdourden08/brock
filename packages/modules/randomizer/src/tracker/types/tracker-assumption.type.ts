/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface TrackerAssumption {
  id: string;
  label: Text;
  initial: boolean;
  hint?: Text;
}

export type { TrackerAssumption };
