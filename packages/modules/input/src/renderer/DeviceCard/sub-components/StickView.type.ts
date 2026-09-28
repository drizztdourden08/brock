/* @layer renderer-shell @kind types */
import type { StickPoint } from '../../../calibration.type';

interface StickViewProps {
  label: string;
  point: StickPoint;
  calibrated: boolean;
}

export type { StickViewProps };
