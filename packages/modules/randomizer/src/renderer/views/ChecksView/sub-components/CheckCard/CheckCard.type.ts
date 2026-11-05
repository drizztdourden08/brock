/* @layer renderer-shell @kind types */
import type { CheckRow } from '../../behavior/check-row.type';

interface CheckCardProps {
  row: CheckRow;
  onToggle(key: string): void;
}

export type { CheckCardProps };
