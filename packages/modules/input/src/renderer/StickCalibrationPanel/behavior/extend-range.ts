/* @layer renderer-shell @kind logic */
import type { StickRange } from '../StickCalibrationPanel.type';

const extendRange = (range: StickRange, x: number, y: number): StickRange => ({
  minX: Math.min(range.minX, x),
  maxX: Math.max(range.maxX, x),
  minY: Math.min(range.minY, y),
  maxY: Math.max(range.maxY, y),
});

export { extendRange };
