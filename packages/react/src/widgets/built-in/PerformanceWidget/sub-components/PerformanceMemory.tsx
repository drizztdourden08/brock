/* @layer renderer-shell @kind component */
import { memo, useMemo } from 'react';
import { formatBytes } from '@drizztdourden08/brock-core';
import { Flex, Span, StackedBar, Stack } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../../i18n';
import { memorySegments } from '../behavior/memory-segments';
import { processTotals } from '../behavior/process-totals';
import type { PerformanceMemoryProps } from '../PerformanceWidget.type';

const PerformanceMemoryView = (props: PerformanceMemoryProps) => {
  const { processes } = props;
  const t = useT();
  const text = useText();
  const segments = useMemo(() => (processes ? memorySegments(processes.data.processes, text) : []), [processes, text]);
  if (!processes) return null;
  const used = processTotals(processes.data).memoryBytes;

  return (
    <Stack gap="sm" className="performance-widget__panel performance-widget__memory">
      <Flex justify="between" align="baseline" gap="sm">
        <Span className="performance-widget__heading">{t('brock-app:perf.memory.title')}</Span>
        <Span className="performance-widget__figure">{t('brock-app:perf.memory.figure', { used: formatBytes(used), total: formatBytes(processes.data.memoryTotalBytes) })}</Span>
      </Flex>
      <StackedBar segments={segments} legend label={t('brock-app:perf.memory.title')} format={formatBytes} />
    </Stack>
  );
};

const PerformanceMemory = memo(PerformanceMemoryView);

export { PerformanceMemory };
