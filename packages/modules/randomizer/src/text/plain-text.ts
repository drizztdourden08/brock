/* @layer core @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';

const plainText = (value: Text): string => (typeof value === 'string' ? value : value.key);

export { plainText };
