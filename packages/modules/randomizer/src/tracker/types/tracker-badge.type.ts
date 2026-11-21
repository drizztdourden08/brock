/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

type TrackerBadgeTone = 'neutral' | 'success' | 'warning';

interface TrackerBadge {
  id: string;
  label: Text;
  tone: TrackerBadgeTone;
  title?: Text;
}

export type { TrackerBadge, TrackerBadgeTone };
