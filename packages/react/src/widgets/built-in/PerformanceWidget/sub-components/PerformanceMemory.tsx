/* @layer renderer-shell @kind component */
import { memo, useMemo } from 'react';
import { formatBytes } from '@drizztdourden08/brock-core';
import { StackedBar } from '@drizztdourden08/tessera/composites';
import { Flex, Span, Stack } from '@drizztdourden08/tessera/primitives';
import { memorySegments } from '../behavior/memory-segments';
import { processTotals } from '../behavior/process-totals';
import type { PerformanceMemoryProps } from '../PerformanceWidget.type';

const PerformanceMemoryView = (props: PerformanceMemoryProps) => {
  const { processes } = props;
  const segments = useMemo(() => (processes ? memorySegments(processes.data.processes) : []), [processes]);
  if (!processes) return null;
  const used = processTotals(processes.data).memoryBytes;

  return (
    <Stack gap="sm" className="performance-widget__panel performance-widget__memory">
      <Flex justify="between" align="baseline" gap="sm">
        <Span className="performance-widget__heading">Memory by process</Span>
        <Span className="performance-widget__figure">{`${formatBytes(used)} of ${formatBytes(processes.data.memoryTotalBytes)}`}</Span>
      </Flex>
      <StackedBar segments={segments} legend label="Memory by process" format={formatBytes} />
    </Stack>
  );
};

const PerformanceMemory = memo(PerformanceMemoryView);

export { PerformanceMemory };
