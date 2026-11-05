/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type CheatsTabDef = {
  id: string;
  label: string;
  content: ReactNode;
};

type CheatsFrameProps = {
  tabs: readonly CheatsTabDef[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
};

export type { CheatsFrameProps, CheatsTabDef };
