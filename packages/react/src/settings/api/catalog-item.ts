/* @layer renderer-shell @kind logic */
import type { SettingItem, SettingValues } from '../settings.type';
import { catalogControl } from './catalog-control';
import type { CatalogItem } from './settings-catalog.type';

const catalogItem = (item: SettingItem, shown: SettingValues, read: (key: string) => unknown, custom: boolean): CatalogItem => {
  const value = read(item.key);
  const control = catalogControl(item.control, value);
  return {
    key: item.key,
    label: item.label,
    ...(item.description === undefined ? {} : { description: item.description }),
    ...(item.hint === undefined ? {} : { hint: item.hint }),
    control,
    source: custom ? 'custom' : 'app',
    settable: !custom && control.kind !== 'none',
    visible: item.visible === undefined || item.visible(shown),
    ...(item.control?.kind === 'password' || value === undefined ? {} : { value }),
  };
};

export { catalogItem };
