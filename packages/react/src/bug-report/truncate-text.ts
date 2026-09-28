/* @layer renderer-shell @kind logic */
import { TRUNCATED_MARK } from './bug-report.constants';

const truncateText = (text: string, length: number): string =>
  length >= text.length ? text : `${text.slice(0, Math.max(0, length))}\n${TRUNCATED_MARK}`;

export { truncateText };
