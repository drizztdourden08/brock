/* @layer renderer-shell @kind types */
import type { ImportKind } from '../../../store/import-job';

interface ImportProgressState {
  active: boolean;
  percent: number | null;
  label: string;
}

export type { ImportKind, ImportProgressState };
