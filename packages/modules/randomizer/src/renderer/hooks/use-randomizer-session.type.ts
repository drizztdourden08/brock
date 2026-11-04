/* @layer renderer-shell @kind types */
import type { PlacementSummary } from '../../contract/placement-summary.type';
import type { RandomizerSession, SessionStatus } from '../../session';

interface RandomizerSessionView {
  session: RandomizerSession | null;
  status: SessionStatus;
  summary: PlacementSummary | null;
  gameRunning: boolean;
}

export type { RandomizerSessionView };
