/* @layer renderer-shell @kind types */
interface StickPlotPoint {
  x: number;
  y: number;
}

interface StickPlotRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

type StickPlotSize = 'md' | 'lg';

interface StickPlotProps {
  x: number;
  y: number;
  label?: string;
  calibrated?: boolean;
  showValue?: boolean;
  innerDeadzone?: number;
  outerDeadzone?: number;
  range?: StickPlotRange;
  center?: StickPlotPoint;
  size?: StickPlotSize;
  className?: string;
}

export type { StickPlotPoint, StickPlotProps, StickPlotRange, StickPlotSize };
