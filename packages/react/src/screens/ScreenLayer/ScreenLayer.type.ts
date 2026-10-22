/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { BackAction } from '@drizztdourden08/tessera/primitives';
import type { ScreenSize } from '../conventions/screens-config.type';
import type { ScreenHeader } from '../screen.type';

interface ScreenLayerProps {
  title: ReactNode;
  icon: ReactNode;
  header?: ScreenHeader;
  size?: ScreenSize;
  subtitle?: ReactNode;
  extra?: ReactNode;
  floating?: ReactNode;
  hidden?: boolean;
  square?: boolean;
  free?: string;
  cornerTitle?: boolean;
  back?: BackAction;
  onClose: () => void;
  children: ReactNode;
}

export type { ScreenLayerProps };
