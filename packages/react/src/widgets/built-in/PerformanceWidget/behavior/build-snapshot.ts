/* @layer renderer-shell @kind logic */
import { SNAPSHOT_TITLE } from '../PerformanceWidget.constants';
import type { PerformanceGroup } from '../PerformanceWidget.type';

const buildSnapshot = (groups: readonly PerformanceGroup[], at: Date): string =>
  [
    `${SNAPSHOT_TITLE}, ${at.toISOString()}`,
    ...groups.flatMap((group) => ['', group.title, ...group.rows.map((row) => `  ${row.label}: ${row.value}`)]),
  ].join('\n');

export { buildSnapshot };
