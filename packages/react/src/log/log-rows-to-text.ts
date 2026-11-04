/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const logRowsToText = (rows: readonly LogRow[]): string =>
  rows.map((row) => `[${row.gutter}] ${row.tag} ${row.message}`).join('\n');

export { logRowsToText };
