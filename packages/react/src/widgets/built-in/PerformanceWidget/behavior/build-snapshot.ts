/* @layer renderer-shell @kind logic */
import { fallbackText } from '../../../../i18n/fallback-text';
import { SNAPSHOT_TITLE } from '../PerformanceWidget.constants';
import type { PerformanceGroup } from '../PerformanceWidget.type';

const buildSnapshot = (groups: readonly PerformanceGroup[], at: Date, title: string = fallbackText(SNAPSHOT_TITLE)): string =>
  [
    `${title}, ${at.toISOString()}`,
    ...groups.flatMap((group) => ['', group.title, ...group.rows.map((row) => `  ${row.label}: ${row.value}`)]),
  ].join('\n');

export { buildSnapshot };
