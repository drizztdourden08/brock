/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface RenderErrorBoundaryProps {
  scope: string;
  label?: string;
  onHome?: () => void;
  resetKey?: unknown;
  children: ReactNode;
}

interface RenderErrorActionsProps {
  onHome?: () => void;
}

export type { RenderErrorActionsProps, RenderErrorBoundaryProps };
