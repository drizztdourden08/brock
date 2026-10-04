/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, ScrollArea, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useCopyText } from '../../../hooks/useCopyText';
import { useWidgetPref } from '../../../hooks/useWidgetPref';
import { buildSnapshot } from './behavior/build-snapshot';
import { performanceGroups } from './behavior/performance-groups';
import { useAppFacts } from './behavior/useAppFacts';
import { useProcessSampler } from './behavior/useProcessSampler';
import { useRendererSampler } from './behavior/useRendererSampler';
import { useSamplingActive } from './behavior/useSamplingActive';
import { PerformanceSection } from './sub-components/PerformanceSection';
import { DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, MS_PER_SECOND, PERFORMANCE_WIDGET_ID, REFRESH_PREF, SECTIONS_PREF } from './PerformanceWidget.constants';
import type { PerformanceSectionId } from './PerformanceWidget.type';
import './PerformanceWidget.css';

const PerformanceWidget = () => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [refreshMs] = useWidgetPref<number>(PERFORMANCE_WIDGET_ID, REFRESH_PREF, DEFAULT_REFRESH_MS);
  const [shown] = useWidgetPref<readonly PerformanceSectionId[]>(PERFORMANCE_WIDGET_ID, SECTIONS_PREF, DEFAULT_SECTIONS);
  const active = useSamplingActive(root);
  const renderer = useRendererSampler(active && shown.includes('renderer'), refreshMs);
  const processes = useProcessSampler(active && shown.includes('processes'), refreshMs);
  const facts = useAppFacts();
  const groups = useMemo(() => performanceGroups(shown, renderer, processes, facts), [shown, renderer, processes, facts]);
  const { copied, copy } = useCopyText();
  const copySnapshot = useCallback(() => void copy(buildSnapshot(groups, new Date())), [copy, groups]);

  return (
    <Box ref={setRoot} className="performance-widget" data-sampling={active ? 'on' : 'off'}>
      <Flex className="performance-widget__bar" justify="between" align="center" gap="sm">
        <Text variant="caption">{active ? `Every ${refreshMs / MS_PER_SECOND} s` : 'Paused'}</Text>
        <Button size="sm" variant="secondary" onClick={copySnapshot}>{copied ? 'Copied' : 'Copy snapshot'}</Button>
      </Flex>
      <ScrollArea className="performance-widget__body" scrollbar="slim">
        <Stack gap="md">
          {groups.map((group) => <PerformanceSection key={group.id} group={group} />)}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export { PerformanceWidget };
