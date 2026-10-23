/* @layer renderer-shell @kind types */
import type { RefObject } from 'react';

interface MenuBarKeysInput {
  row: RefObject<HTMLElement | null>;
  open: number | null;
  setOpen: (index: number | null) => void;
}

export type { MenuBarKeysInput };
