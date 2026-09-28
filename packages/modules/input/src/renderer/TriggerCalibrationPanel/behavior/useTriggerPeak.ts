/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { useControllerStateStore } from '../../useControllerStateStore';

const useTriggerPeak = (deviceKey: string, axisIndex: number, tracking: boolean) => {
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    if (!tracking) return undefined;
    return useControllerStateStore.subscribe((s) => {
      const value = s.states[deviceKey]?.axes[axisIndex];
      if (value !== undefined) setPeak((current) => Math.max(current, value));
    });
  }, [tracking, deviceKey, axisIndex]);

  return { peak, setPeak };
};

export { useTriggerPeak };
