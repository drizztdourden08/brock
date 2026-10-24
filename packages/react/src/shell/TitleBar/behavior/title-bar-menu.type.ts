/* @layer renderer-shell @kind types */
import type { MenuGroup, MenuNode, WindowTitleBarViewPlace } from '@drizztdourden08/tessera/composites';
import type { TuckedRow } from '../../../menu/menu-config.type';

type TuckedPlaces = Partial<Record<TuckedRow, WindowTitleBarViewPlace>>;

interface TitleBarMenu {
  groups: MenuGroup[];
  view?: WindowTitleBarViewPlace;
  tucked?: TuckedPlaces;
  viewItems?: MenuNode[];
}

export type { TitleBarMenu, TuckedPlaces };
