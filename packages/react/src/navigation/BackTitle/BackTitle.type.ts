/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface BackTitleProps {
  title: ReactNode;
  label?: string;
  onBack: () => void;
}

export type { BackTitleProps };
