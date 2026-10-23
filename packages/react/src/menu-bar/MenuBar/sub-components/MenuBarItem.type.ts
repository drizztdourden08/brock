/* @layer renderer-shell @kind types */
import type { MenuNode } from '@drizztdourden08/tessera/composites';

interface MenuBarItemProps {
  label: string;
  nodes: readonly MenuNode[];
  open: boolean;
  peek: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export type { MenuBarItemProps };
