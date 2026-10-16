/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ProductMenuEntry } from '@drizztdourden08/brock-core';
import type { ShowRule } from '../screens/show/show.type';

interface MenuItem extends Omit<ProductMenuEntry, 'label'> {
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
  show?: ShowRule;
  useDisabled?: () => boolean;
}

type MenuEntry = MenuItem | 'separator';

interface MenuSection {
  id: string;
  label: string;
  icon: string;
}

export type { MenuEntry, MenuItem, MenuSection };
