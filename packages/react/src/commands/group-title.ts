/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { GROUP_TITLES } from './commands.constants';

const groupTitle = (title: string): Text => GROUP_TITLES[title] ?? title;

export { groupTitle };
