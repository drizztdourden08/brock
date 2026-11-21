/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { groupKey } from './group-key';

const textGroupKey = (label: Text): string => groupKey(typeof label === 'string' ? label : label.key);

export { textGroupKey };
