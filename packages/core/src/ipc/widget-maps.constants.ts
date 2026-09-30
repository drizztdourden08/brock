/* @layer core @kind constants */
import type { WidgetEventContract, WidgetInvokeContract, WidgetSendContract } from './widget-contract.type';

const WIDGET_INVOKE_MAP = {
  popOutWidget: 'widget:popOut',
  listPoppedWidgets: 'widget:listPopped',
  setWidgetPin: 'widget:setPin',
  getWidgetWindowState: 'widget:getWindowState',
} as const satisfies Record<string, keyof WidgetInvokeContract>;

const WIDGET_SEND_MAP = {
  dockBackWidget: 'widget:dockBack',
  setWidgetSnap: 'widget:setSnap',
  setWidgetFrame: 'widget:setFrame',
  publishWidgetSlice: 'widget:publish',
  subscribeWidgetRelay: 'widget:subscribe',
} as const satisfies Record<string, keyof WidgetSendContract>;

const WIDGET_EVENT_MAP = {
  onWidgetRelay: 'widget:relay',
  onWidgetSnapshotRequest: 'widget:snapshotRequest',
  onWidgetClosed: 'widget:closed',
  onWidgetBounds: 'widget:bounds',
  onWidgetDragOver: 'widget:dragOver',
  onWidgetDropIn: 'widget:dropIn',
  onWidgetPopped: 'widget:popped',
  onWidgetFrame: 'widget:frame',
  onWidgetWindowState: 'widget:windowState',
} as const satisfies Record<string, keyof WidgetEventContract>;

export { WIDGET_EVENT_MAP, WIDGET_INVOKE_MAP, WIDGET_SEND_MAP };
