/* @layer renderer-shell @kind logic */
import type { MenuItem } from '../menu/menu.type';
import type { WidgetMenuPlacement } from './widget.type';

const menuPlacementOf = (menu: WidgetMenuPlacement | undefined): Pick<MenuItem, 'parent' | 'group' | 'order'> => {
  if (menu === undefined) return {};
  const { parent, group, order } = menu;
  return { ...(parent === undefined ? {} : { parent }), ...(group === undefined ? {} : { group }), ...(order === undefined ? {} : { order }) };
};

export { menuPlacementOf };
