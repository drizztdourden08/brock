/* @layer renderer-shell @kind logic */
import { nav } from '../navigation/nav';
import { scrollToAnchor } from './scroll-to-anchor';

const openSettingTarget = (target: string): void => {
  const [route = '', anchor] = target.split('#');
  if (route !== '') nav.open(route);
  if (anchor) scrollToAnchor(anchor);
};

export { openSettingTarget };
