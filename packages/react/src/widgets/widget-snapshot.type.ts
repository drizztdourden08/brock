/* @layer renderer-shell @kind types */
import type { Rect, SnapSide, WidgetPlacement } from '@drizztdourden08/tessera/composites';

interface WidgetSnapshot {
  id: string;
  label: string;
  visible: boolean;
  placement: WidgetPlacement | null;
  side: SnapSide | null;
  size: number | null;
  index: number | null;
  tab: number | null;
  rect: Rect | null;
  popped: boolean;
  context: string;
  available: boolean;
}

interface WidgetDockOptions {
  side: SnapSide;
  size?: number;
  index?: number;
}

interface WidgetSized {
  size: number | null;
  reason: string | null;
}

type WidgetFloatRect = Partial<Pick<Rect, 'x' | 'y'>> & Pick<Rect, 'width' | 'height'>;

type WidgetListener = (snapshot: readonly WidgetSnapshot[]) => void;

export type { WidgetDockOptions, WidgetFloatRect, WidgetListener, WidgetSized, WidgetSnapshot };
