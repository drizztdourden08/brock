/* @layer renderer-shell @kind types */
import type { MenuEntry } from '../../../../menu/menu.type';
import type { TitleBarSlot } from '../../../../modules/renderer-module.type';

interface AppTitleBarProps {
  title: string;
  menu: readonly MenuEntry[];
  instanceName: string | null;
  logoSrc?: string;
  instanceLogoSrc?: string;
  slots?: readonly TitleBarSlot[];
  hidden: boolean;
}

export type { AppTitleBarProps };
