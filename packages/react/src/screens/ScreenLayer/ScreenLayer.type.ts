/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ScreenLayerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  floating?: ReactNode;
  hidden?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export type { ScreenLayerProps };
