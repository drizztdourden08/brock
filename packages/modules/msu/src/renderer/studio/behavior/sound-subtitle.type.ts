/* @layer renderer-shell @kind types */
interface SubtitleCounts {
  channel: string;
  total: number;
  raisedCount: number;
  reachableCount: number;
  hiddenCount: number;
  showUnreachable: boolean;
}

export type { SubtitleCounts };
