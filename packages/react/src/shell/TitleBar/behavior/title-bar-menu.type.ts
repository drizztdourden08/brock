/* @layer renderer-shell @kind types */
import type { MenuGroup, WindowTitleBarViewPlace } from '@drizztdourden08/tessera/composites';

interface TitleBarMenu {
  groups: MenuGroup[];
  view?: WindowTitleBarViewPlace;
}

export type { TitleBarMenu };
