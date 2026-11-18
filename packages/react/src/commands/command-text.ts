/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { controlSources } from '../app/control-sources';

const commandText = (value: Text): string => controlSources.get().text(value);

export { commandText };
