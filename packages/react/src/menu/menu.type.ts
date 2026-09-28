/* @layer renderer-shell @kind types */
interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  screen?: string;
  onClick?: () => void;
  children?: MenuEntry[];
}

type MenuEntry = MenuItem | 'separator';

export type { MenuEntry, MenuItem };
