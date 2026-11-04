/* @layer renderer-shell @kind logic */
import type { CheckRow } from './check-row.type';

const checkRowKey = (row: CheckRow): string => row.key;

export { checkRowKey };
