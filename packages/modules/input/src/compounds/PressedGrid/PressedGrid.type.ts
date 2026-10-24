/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { InputIconFamily, InputIconSource } from '@drizztdourden08/tessera/primitives';

interface PressedGridItem {
  id: string;
  label?: ReactNode;
  title?: string;
  icon?: InputIconSource;
}

interface PressedGridProps {
  items: readonly PressedGridItem[];
  pressed: readonly string[];
  family?: InputIconFamily;
  className?: string;
}

interface PressedGridCellProps {
  item: PressedGridItem;
  family?: InputIconFamily;
  down: boolean;
}

export type { PressedGridCellProps, PressedGridItem, PressedGridProps };
