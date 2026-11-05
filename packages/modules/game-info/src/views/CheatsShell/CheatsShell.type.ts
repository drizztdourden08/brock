/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface CheatsTab {
  id: string;
  label: string;
  render: () => ReactNode;
}

interface CheatsShellProps {
  tabs: readonly CheatsTab[];
  enabled: boolean;
  offReason: string;
  defaultTab?: string;
}

export type { CheatsShellProps, CheatsTab };
