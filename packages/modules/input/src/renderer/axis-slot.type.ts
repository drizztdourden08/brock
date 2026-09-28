/* @layer renderer-shell @kind types */
import type { StickSide } from '../calibration.type';

interface StickSlot {
  side: StickSide;
  label: string;
  xAxis: number;
  yAxis: number;
}

interface TriggerSlot {
  axisIndex: number;
  label: string;
}

export type { StickSlot, TriggerSlot };
