/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useCopyText } from '../../../hooks/useCopyText';
import { useWidgetPref } from '../../../hooks/useWidgetPref';
import { buildSnapshot } from './behavior/build-snapshot';
import { performanceGroups } from './behavior/performance-groups';
import { useAppFacts } from './behavior/useAppFacts';
import { useProcessSampler } from './behavior/useProcessSampler';
import { useRendererSampler } from './behavior/useRendererSampler';
import { useSamplingActive } from './behavior/useSamplingActive';
import { PerformanceActivity } from './sub-components/PerformanceActivity';
import { PerformanceBar } from './sub-components/PerformanceBar';
import { PerformanceDetails } from './sub-components/PerformanceDetails';
import { PerformanceGauges } from './sub-components/PerformanceGauges';
import { PerformanceMemory } from './sub-components/PerformanceMemory';
import { PerformanceTiles } from './sub-components/PerformanceTiles';
import { DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, PERFORMANCE_WIDGET_ID, REFRESH_PREF, SECTIONS_PREF } from './PerformanceWidget.constants';
import type { PerformanceSectionId } from './PerformanceWidget.type';
import './PerformanceWidget.css';

const PerformanceWidget = () => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [refreshMs] = useWidgetPref<number>(PERFORMANCE_WIDGET_ID, REFRESH_PREF, DEFAULT_REFRESH_MS);
  const [shown] = useWidgetPref<readonly PerformanceSectionId[]>(PERFORMANCE_WIDGET_ID, SECTIONS_PREF, DEFAULT_SECTIONS);
  const active = useSamplingActive(root);
  const renderer = useRendererSampler(active && shown.includes('renderer'), refreshMs);
  const processes = useProcessSampler(active && shown.includes('processes'), refreshMs);
  const rendererSample = renderer?.sample ?? null;
  const processSample = processes?.sample ?? null;
  const facts = useAppFacts();
  const groups = useMemo(() => performanceGroups(shown, rendererSample, processSample, facts), [shown, rendererSample, processSample, facts]);
  const { copied, copy } = useCopyText();
  const copySnapshot = useCallback(() => void copy(buildSnapshot(groups, new Date())), [copy, groups]);

  return (
    <Box ref={setRoot} className="performance-widget" data-sampling={active ? 'on' : 'off'}>
      <PerformanceBar active={active} refreshMs={refreshMs} copied={copied} onCopy={copySnapshot} />
      <PerformanceTiles renderer={renderer} processes={processes} shown={shown} />
      <Box className="performance-widget__panels">
        <PerformanceGauges renderer={rendererSample} processes={processSample} shown={shown} />
        <Box className="performance-widget__column">
          <PerformanceMemory processes={shown.includes('processes') ? processSample : null} />
          <PerformanceActivity renderer={renderer} facts={facts} shown={shown} />
        </Box>
      </Box>
      <PerformanceDetails groups={groups} />
    </Box>
  );
};

export { PerformanceWidget };
