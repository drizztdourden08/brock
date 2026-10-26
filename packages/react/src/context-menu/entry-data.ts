/* @layer renderer-shell @kind logic */
import type { MenuItem } from '@drizztdourden08/tessera/composites';
import { MENU_ENTRY_ATTRIBUTE } from './context-menu.constants';

const entryData = (value: string): Pick<MenuItem, 'data'> => ({ data: { [MENU_ENTRY_ATTRIBUTE]: value } });

export { entryData };
