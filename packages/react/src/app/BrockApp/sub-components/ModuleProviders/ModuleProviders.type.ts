/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';

interface ModuleProvidersProps {
  providers: readonly ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}

export type { ModuleProvidersProps };
