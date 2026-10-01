/* @layer renderer-shell @kind types */
import type { TitleBarControls } from '@drizztdourden08/brock-core';
import type { MenuEntry } from '../../../../menu/menu.type';
import type { TitleBarSlot } from '../../../../modules/renderer-module.type';

interface AppTitleBarProps {
  title: string;
  menu: readonly MenuEntry[];
  controls: TitleBarControls;
  instanceName: string | null;
  logoSrc?: string;
  instanceLogoSrc?: string;
  slots?: readonly TitleBarSlot[];
  hidden: boolean;
}

export type { AppTitleBarProps };
