/* @layer electron-main @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import type { GroupLayout } from './widget-windows.type';

const groupLayouts = new Map<WidgetWindowGroup, GroupLayout>();

export { groupLayouts };
