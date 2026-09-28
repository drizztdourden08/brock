/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ModulePorts } from '../platform.type';

interface PlatformProviderProps {
  ports?: ModulePorts;
  children: ReactNode;
}

export type { PlatformProviderProps };
