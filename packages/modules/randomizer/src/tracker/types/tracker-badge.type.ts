/* @layer core @kind types */
type TrackerBadgeTone = 'neutral' | 'success' | 'warning';

interface TrackerBadge {
  id: string;
  label: string;
  tone: TrackerBadgeTone;
  title?: string;
}

export type { TrackerBadge, TrackerBadgeTone };
