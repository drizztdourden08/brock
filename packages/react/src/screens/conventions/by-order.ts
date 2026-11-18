/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../i18n/fallback-text';

const byOrder = <T extends { order: number; label: Text }>(a: T, b: T): number =>
  a.order === b.order ? fallbackText(a.label).localeCompare(fallbackText(b.label)) : a.order - b.order;

export { byOrder };
