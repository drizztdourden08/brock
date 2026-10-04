/* @layer renderer-shell @kind types */
import type { TitleBarControls } from '@drizztdourden08/brock-core';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../../../menu/menu.type';

interface AppTitleBarProps {
  title: string;
  menu: readonly MenuEntry[];
  controls: TitleBarControls;
  instanceName: string | null;
  logoSrc?: string;
  instanceLogoSrc?: string;
  actions?: readonly WindowTitleBarAction[];
  hidden: boolean;
}

export type { AppTitleBarProps };
