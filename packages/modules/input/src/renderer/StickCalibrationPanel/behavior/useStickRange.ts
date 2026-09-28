/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { StickSlot } from '../../axis-slot.type';
import { useControllerStateStore } from '../../useControllerStateStore';
import type { StickRange } from '../StickCalibrationPanel.type';
import { extendRange } from './extend-range';

const useStickRange = (deviceKey: string, slot: StickSlot, tracking: boolean) => {
  const [range, setRange] = useState<StickRange>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const { xAxis, yAxis } = slot;

  useEffect(() => {
    if (!tracking) return undefined;
    return useControllerStateStore.subscribe((s) => {
      const axes = s.states[deviceKey]?.axes;
      if (axes) setRange((current) => extendRange(current, axes[xAxis] ?? 0, axes[yAxis] ?? 0));
    });
  }, [tracking, deviceKey, xAxis, yAxis]);

  return { range, setRange };
};

export { useStickRange };
