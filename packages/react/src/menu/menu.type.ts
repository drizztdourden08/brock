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
  confirm?: string;
  bucket?: string;
  page?: string;
  tab?: string;
  onClick?: () => void;
  children?: MenuEntry[];
  section?: string;
  devOnly?: boolean;
}

type MenuEntry = MenuItem | 'separator';

interface MenuConfirmState {
  armed: string | null;
  arm: (key: string) => void;
  disarm: () => void;
}

interface MenuSection {
  id: string;
  label: string;
  icon: string;
}

export type { MenuConfirmState, MenuEntry, MenuItem, MenuSection };
