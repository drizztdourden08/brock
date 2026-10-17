/* @layer renderer-shell @kind types */
type BodyStatus = 'waiting' | 'open' | 'closed';

interface PendingBody {
  release: () => void;
  status: () => BodyStatus;
  frames: number;
  since: number;
}

export type { BodyStatus, PendingBody };
