/* @layer renderer-shell @kind types */
import type { SnapSide, SplitNode, WidgetLayout } from '@drizztdourden08/tessera/composites';

interface ResizeStep {
  split: SplitNode;
  at: number;
}

interface EdgeStep {
  step: ResizeStep;
  along: number;
}

interface EdgeWidth {
  id: string;
  side: SnapSide;
  px: number;
}

interface ShareLimit {
  size: number;
  reason: string | null;
}

interface SizedLayout {
  layout: WidgetLayout;
  reason: string | null;
}

export type { EdgeStep, EdgeWidth, ResizeStep, ShareLimit, SizedLayout };
