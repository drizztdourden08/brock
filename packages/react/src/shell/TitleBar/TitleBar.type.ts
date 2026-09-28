/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MenuEntry } from '../../menu/menu.type';

interface TitleBarProps {
  productName: string;
  menu?: readonly MenuEntry[];
  instanceName?: string | null;
  logoSrc?: string;
  instanceLogoSrc?: string;
  extra?: ReactNode;
  hidden?: boolean;
  showPin?: boolean;
  className?: string;
}

export type { TitleBarProps };
