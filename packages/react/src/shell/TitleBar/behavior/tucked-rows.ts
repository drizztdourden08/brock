/* @layer renderer-shell @kind logic */
import type { WindowTitleBarTucked, WindowTitleBarTuckedItem } from '@drizztdourden08/tessera/composites';
import { TUCKED_ROWS } from '../../../menu/menu-config.constants';
import type { MenuConfig, TuckedRow } from '../../../menu/menu-config.type';
import { sanitizeOverride } from '../../../menu/sanitize-override';
import type { TuckedPlaces } from './title-bar-menu.type';

const rowOf = (config: MenuConfig | undefined, key: string, place: WindowTitleBarTuckedItem = {}): WindowTitleBarTuckedItem => {
  const { label, activeLabel, hidden, inMenu } = sanitizeOverride(key, config?.entries?.[key], []);
  return {
    ...place,
    ...(label === undefined ? {} : { label }),
    ...(activeLabel === undefined ? {} : { activeLabel }),
    ...(hidden === true || inMenu === false ? { hidden: true } : {}),
  };
};

const tuckedRows = (config: MenuConfig | undefined, places: TuckedPlaces = {}): WindowTitleBarTucked => {
  const rows: WindowTitleBarTucked = {};
  for (const [row, key] of Object.entries(TUCKED_ROWS) as [TuckedRow, string][]) {
    const item = rowOf(config, key, places[row]);
    if (Object.keys(item).length > 0) rows[row] = item;
  }
  return rows;
};

export { tuckedRows };
