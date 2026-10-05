/* @layer renderer-shell @kind logic */
import { nav } from '../navigation/nav';
import type { MenuResolver } from './to-menu-groups.type';

const navResolver: MenuResolver = { openScreen: (id, fresh) => (fresh ? nav.home(id) : nav.open(id)) };

export { navResolver };
