/* @layer renderer-shell @kind types */
import type { ImportProgressState } from '../../behavior/use-import-progress.type';

interface ImportProgressProps {
  state: ImportProgressState;
  fallbackLabel?: string;
}

export type { ImportProgressProps };
