/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { PressedGridItem, StickPlotPoint, StickPlotRange } from '@drizztdourden08/tessera/composites';
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';

interface CalibrationPanelAction {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

interface CalibrationControl {
  name: string;
  label: string;
}

interface CalibrationStickReading extends CalibrationControl {
  kind: 'stick';
  x: number;
  y: number;
  center?: StickPlotPoint;
  range?: StickPlotRange;
  innerDeadzone?: number;
  outerDeadzone?: number;
}

interface CalibrationTriggerReading extends CalibrationControl {
  kind: 'trigger';
  value: number;
  peak?: number;
}

type CalibrationReading = CalibrationStickReading | CalibrationTriggerReading;

interface CalibrationButtons {
  items: readonly PressedGridItem[];
  pressed: readonly string[];
}

interface CalibrationPanelProps {
  title: ReactNode;
  instruction: ReactNode;
  reading?: CalibrationReading;
  buttons?: CalibrationButtons;
  family?: InputIconFamily;
  readout?: ReactNode;
  action: CalibrationPanelAction;
  onCancel: () => void;
  cancelLabel?: string;
  children?: ReactNode;
  className?: string;
}

export type {
  CalibrationButtons, CalibrationControl, CalibrationPanelAction, CalibrationPanelProps, CalibrationReading, CalibrationStickReading,
  CalibrationTriggerReading,
};
