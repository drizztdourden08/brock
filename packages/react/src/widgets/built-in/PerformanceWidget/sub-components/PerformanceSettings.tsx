/* @layer renderer-shell @kind component */
import { Checkbox, SegmentedControl, Stack } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../../i18n';
import { useWidgetPref } from '../../../../hooks/useWidgetPref';
import {
  DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, PERFORMANCE_SECTIONS, MS_PER_SECOND, PERFORMANCE_WIDGET_ID, REFRESH_PREF, REFRESH_STEPS_MS, SECTIONS_PREF,
} from '../PerformanceWidget.constants';
import type { PerformanceSectionId } from '../PerformanceWidget.type';

const PerformanceSettings = () => {
  const t = useT();
  const text = useText();
  const [refreshMs, setRefreshMs] = useWidgetPref<number>(PERFORMANCE_WIDGET_ID, REFRESH_PREF, DEFAULT_REFRESH_MS);
  const [shown, setShown] = useWidgetPref<readonly PerformanceSectionId[]>(PERFORMANCE_WIDGET_ID, SECTIONS_PREF, DEFAULT_SECTIONS);
  const toggle = (id: PerformanceSectionId, on: boolean): void =>
    setShown(PERFORMANCE_SECTIONS.map((section) => section.id).filter((sectionId) => (sectionId === id ? on : shown.includes(sectionId))));

  const choices = REFRESH_STEPS_MS.map((step) => ({ value: String(step), label: t('brock-app:perf.refresh.step', { seconds: step / MS_PER_SECOND }) }));
  return (
    <Stack gap="sm" className="performance-settings">
      <SegmentedControl label={t('brock-app:perf.refresh.label')} size="sm" value={String(refreshMs)} options={choices} onChange={(value) => setRefreshMs(Number(value))} />
      {PERFORMANCE_SECTIONS.map((section) => (
        <Checkbox key={section.id} size="sm" label={text(section.label)} checked={shown.includes(section.id)} onChange={(on) => toggle(section.id, on)} />
      ))}
    </Stack>
  );
};

export { PerformanceSettings };
