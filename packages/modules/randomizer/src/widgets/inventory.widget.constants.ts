/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const INVENTORY_WIDGET_ID = 'inventory';
const INVENTORY_WIDGET_LABEL = msg('randomizer:widget.inventory');
const INVENTORY_WIDGET_ICON = 'layers';
const INVENTORY_DOCKED_SIZE = 320;
const INVENTORY_FLOATING_SIZE = { width: 320, height: 420 } as const;
const LAYOUT_LABEL = 'Inventory layout';

export {
  INVENTORY_DOCKED_SIZE, INVENTORY_FLOATING_SIZE, INVENTORY_WIDGET_ICON, INVENTORY_WIDGET_ID, INVENTORY_WIDGET_LABEL, LAYOUT_LABEL,
};
