/* @layer renderer-shell @kind logic */
import type { ProductMenu } from '@drizztdourden08/brock-core';
import type { TesseraOverrides } from '@drizztdourden08/tessera/primitives';
import { VIEW_MENU_KEY } from '../../../menu/menu-config.constants';
import { TESSERA_OVERRIDES } from '../BrockApp.constants';

const tesseraOverrides = (menu: ProductMenu | undefined): TesseraOverrides => {
  const label: unknown = menu?.entries?.[VIEW_MENU_KEY]?.label;
  return typeof label === 'string' && label.trim() !== '' ? { ...TESSERA_OVERRIDES, strings: { windows: { view: label } } } : TESSERA_OVERRIDES;
};

export { tesseraOverrides };
