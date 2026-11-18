/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../i18n/fallback-text';
import type { MenuItem } from '../menu/menu.type';
import { RESET_LAYOUT_ENTRY } from './widget.constants';

const resetLayoutEntry = (reset: () => void, text: (value: Text) => string = fallbackText): MenuItem => ({ ...RESET_LAYOUT_ENTRY, label: text(RESET_LAYOUT_ENTRY.label), onClick: reset });

export { resetLayoutEntry };
