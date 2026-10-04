/* @layer renderer-shell @kind component */
import { Checkbox, SegmentedControl, Stack } from '@drizztdourden08/tessera/primitives';
import { useWidgetPref } from '../../../../hooks/useWidgetPref';
import {
  DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, PERFORMANCE_SECTIONS, PERFORMANCE_WIDGET_ID, REFRESH_CHOICES, REFRESH_PREF, SECTIONS_PREF,
} from '../PerformanceWidget.constants';
import type { PerformanceSectionId } from '../PerformanceWidget.type';

const PerformanceSettings = () => {
  const [refreshMs, setRefreshMs] = useWidgetPref<number>(PERFORMANCE_WIDGET_ID, REFRESH_PREF, DEFAULT_REFRESH_MS);
  const [shown, setShown] = useWidgetPref<readonly PerformanceSectionId[]>(PERFORMANCE_WIDGET_ID, SECTIONS_PREF, DEFAULT_SECTIONS);
  const toggle = (id: PerformanceSectionId, on: boolean): void =>
    setShown(PERFORMANCE_SECTIONS.map((section) => section.id).filter((sectionId) => (sectionId === id ? on : shown.includes(sectionId))));

  return (
    <Stack gap="sm" className="performance-settings">
      <SegmentedControl label="Refresh" size="sm" value={String(refreshMs)} options={REFRESH_CHOICES} onChange={(value) => setRefreshMs(Number(value))} />
      {PERFORMANCE_SECTIONS.map((section) => (
        <Checkbox key={section.id} size="sm" label={section.label} checked={shown.includes(section.id)} onChange={(on) => toggle(section.id, on)} />
      ))}
    </Stack>
  );
};

export { PerformanceSettings };
