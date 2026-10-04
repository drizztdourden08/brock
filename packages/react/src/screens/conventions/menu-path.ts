/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import type { ScreenMenu } from './screens-config.type';

const menuPath = (menu: ScreenMenu | undefined): string[] | null => {
  if (menu === undefined || menu === false) return null;
  if (menu === 'entry') return [];
  return menu.split(ROUTE_SEPARATOR).map((part) => part.trim()).filter((part) => part !== '');
};

export { menuPath };
