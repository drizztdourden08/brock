/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  screen?: string;
  fresh?: boolean;
  confirm?: string | true;
  onCancel?: () => void;
  bucket?: string;
  page?: string;
  tab?: string;
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
