/* @layer renderer-shell @kind logic */
import type { MenuItem } from '../menu/menu.type';
import { RESET_LAYOUT_ENTRY } from './widget.constants';

const resetLayoutEntry = (reset: () => void): MenuItem => ({ ...RESET_LAYOUT_ENTRY, onClick: reset });

export { resetLayoutEntry };
