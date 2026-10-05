/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { BackAction } from '@drizztdourden08/tessera/primitives';
import type { ScreenHeader } from '../screen.type';

interface ScreenLayerProps {
  title: ReactNode;
  icon: ReactNode;
  header?: ScreenHeader;
  subtitle?: ReactNode;
  extra?: ReactNode;
  floating?: ReactNode;
  hidden?: boolean;
  square?: boolean;
  back?: BackAction;
  onClose: () => void;
  children: ReactNode;
}

export type { ScreenLayerProps };
