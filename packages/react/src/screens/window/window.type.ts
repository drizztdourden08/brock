/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SideNavLayoutPaneScroll } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { CardProps } from '../kinds/screen-kinds.type';

interface WindowRenderContext extends CardProps {
  active: string;
  select: (id: string) => void;
}

interface WindowItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: number | string;
  disabled?: boolean;
  render: (ctx: WindowRenderContext) => ReactNode;
}

interface WindowGroup {
  id: string;
  label?: string;
  items: readonly WindowItem[];
}

interface WindowDef {
  items?: readonly WindowItem[];
  groups?: readonly WindowGroup[];
  initial?: string;
  scroll?: SideNavLayoutPaneScroll;
  narrow?: boolean;
  label?: string;
}

export type { WindowDef, WindowGroup, WindowItem, WindowRenderContext };
