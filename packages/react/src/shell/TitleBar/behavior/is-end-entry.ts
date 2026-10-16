/* @layer renderer-shell @kind logic */
import { END_GROUP } from '../../../menu/menu-config.constants';
import type { MenuItem } from '../../../menu/menu.type';
import { LAST_GROUP_KEYS } from '../TitleBar.constants';

const isEndEntry = (item: MenuItem): boolean => (item.group === undefined ? LAST_GROUP_KEYS.includes(item.key) : item.group === END_GROUP);

export { isEndEntry };
