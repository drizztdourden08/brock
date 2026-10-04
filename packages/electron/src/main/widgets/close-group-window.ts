/* @layer electron-main @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';
import { activeGroup } from './active-group';
import { closeWidgetWindow } from './close-widget-window';
import { groupVisibility } from './group-visibility';

const closeGroupWindow = (id: string, where?: WidgetDockBack): void => {
  const group = where === 'close' ? activeGroup(id) : null;
  closeWidgetWindow(id, where);
  if (group !== null) groupVisibility.close(group, where, id);
};

export { closeGroupWindow };
