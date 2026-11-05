/* @layer renderer-shell @kind types */
import type { ReactNode, RefObject } from 'react';

type AnchoredCardProps = {
  anchorRef: RefObject<HTMLElement | null>;
  title: string;
  role: 'menu' | 'dialog';
  onDismiss: () => void;
  children: ReactNode;
  className?: string;
};

export type { AnchoredCardProps };
