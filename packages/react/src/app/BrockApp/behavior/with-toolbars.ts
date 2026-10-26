/* @layer renderer-shell @kind logic */
import type { MenuItem } from '../../../menu/menu.type';
import { WIDGETS_SECTION_KEY } from '../BrockApp.constants';

const withToolbars = (sections: readonly MenuItem[], toolbars: readonly MenuItem[]): MenuItem[] => {
  if (toolbars.length === 0) return [...sections];
  const at = sections.findIndex((section) => section.key === WIDGETS_SECTION_KEY);
  return [...sections.slice(0, at + 1), ...toolbars, ...sections.slice(at + 1)];
};

export { withToolbars };
