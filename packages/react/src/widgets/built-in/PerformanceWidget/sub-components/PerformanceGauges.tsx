/* @layer renderer-shell @kind component */
import { memo, useState } from 'react';
import { Box, Gauge } from '@drizztdourden08/tessera/primitives';
import { gaugeReadings } from '../behavior/gauge-readings';
import { useGaugeSize } from '../behavior/useGaugeSize';
import { CPU_THRESHOLDS, MEMORY_THRESHOLDS } from '../PerformanceWidget.constants';
import type { PerformanceGaugesProps } from '../PerformanceWidget.type';

const share = (value: number): string => (value < 10 ? value.toFixed(1) : value.toFixed(0));

const PerformanceGaugesView = (props: PerformanceGaugesProps) => {
  const { renderer, processes, shown } = props;
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const { cpu, memory, heap } = gaugeReadings(renderer, processes, shown);
  const count = [cpu, memory, heap].filter((value) => value !== null).length;
  const size = useGaugeSize(panel, count);
  if (count === 0) return null;

  return (
    <Box ref={setPanel} className="performance-widget__panel performance-widget__gauges" data-count={count}>
      {cpu !== null && <Gauge value={cpu} unit="%" label="CPU" size={size} thresholds={CPU_THRESHOLDS} zones format={share} />}
      {memory !== null && <Gauge value={memory} unit="%" label="Memory" size={size} thresholds={MEMORY_THRESHOLDS} zones format={share} />}
      {heap !== null && <Gauge value={heap} unit="%" label="JS heap" size={size} zones format={share} />}
    </Box>
  );
};

const PerformanceGauges = memo(PerformanceGaugesView);

export { PerformanceGauges };
