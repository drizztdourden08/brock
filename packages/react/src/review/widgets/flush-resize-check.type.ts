/* @layer renderer-shell @kind types */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

interface FlushPair {
  main: WidgetWindowBounds;
  own: WidgetWindowBounds;
}

export type { FlushPair };
