/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  screen?: string;
  onClick?: () => void;
  children?: MenuEntry[];
  section?: string;
  devOnly?: boolean;
}

type MenuEntry = MenuItem | 'separator';

interface MenuSection {
  id: string;
  label: string;
  icon: string;
}

export type { MenuEntry, MenuItem, MenuSection };
