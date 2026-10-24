/* @layer renderer-shell @kind types */
import type { StickPlotPoint, StickPlotRange } from '../StickPlot.type';

interface StickPlotCalibrationProps {
  range?: StickPlotRange;
  center?: StickPlotPoint;
}

export type { StickPlotCalibrationProps };
