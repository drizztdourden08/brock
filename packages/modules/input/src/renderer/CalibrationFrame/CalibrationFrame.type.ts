/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface CalibrationAction {
  label: string;
  disabled: boolean;
  run: () => void;
}

interface CalibrationFrameProps {
  title: string;
  instruction: string;
  readout: string;
  action: CalibrationAction;
  onCancel: () => void;
  children?: ReactNode;
}

export type { CalibrationAction, CalibrationFrameProps };
