/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { PerformanceRow, RendererSample } from '../PerformanceWidget.type';

const heapText = (sample: RendererSample, t: I18n['t']): string => {
  if (sample.heapUsedBytes === null) return t('brock-app:perf.value.notReported');
  const used = formatBytes(sample.heapUsedBytes);
  return sample.heapLimitBytes === null ? used : t('brock-app:perf.value.heapOf', { used, limit: formatBytes(sample.heapLimitBytes) });
};

const rendererRows = (sample: RendererSample | null, t: I18n['t']): PerformanceRow[] => {
  if (!sample) return [{ label: t('brock-app:perf.row.frameRate'), value: t('brock-app:perf.value.sampling') }];
  const ms = (value: number): string => t('brock-app:perf.value.ms', { value: value.toFixed(1) });
  return [
    { label: t('brock-app:perf.row.frameRate'), value: t('brock-app:perf.value.fps', { value: sample.fps.toFixed(0) }) },
    { label: t('brock-app:perf.row.frameTime'), value: t('brock-app:perf.value.frameTime', { avg: ms(sample.frameMs), worst: ms(sample.worstFrameMs) }) },
    { label: t('brock-app:perf.row.longTasks'), value: sample.longTasks > 0 ? t('brock-app:perf.value.longTasks', { count: String(sample.longTasks), time: ms(sample.longTaskMs) }) : t('brock-app:perf.value.none') },
    { label: t('brock-app:perf.row.lag'), value: ms(sample.lagMs) },
    { label: t('brock-app:perf.row.jsHeap'), value: heapText(sample, t) },
    { label: t('brock-app:perf.row.domNodes'), value: String(sample.domNodes) },
  ];
};

export { rendererRows };
