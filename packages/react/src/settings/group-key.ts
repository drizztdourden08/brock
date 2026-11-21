/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';

const groupKey = (label: string): string => label.trim().toLowerCase();

const textGroupKey = (label: Text): string => groupKey(typeof label === 'string' ? label : label.key);

export { groupKey, textGroupKey };
