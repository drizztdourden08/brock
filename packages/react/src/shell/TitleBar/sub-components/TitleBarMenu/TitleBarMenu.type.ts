/* @layer renderer-shell @kind types */
import type { RefObject } from 'react';
import type { MenuEntry } from '../../../../menu/menu.type';

interface TitleBarMenuProps {
  menu: readonly MenuEntry[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
}

export type { TitleBarMenuProps };
