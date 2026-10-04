/* @layer core @kind barrel */
export { BASE_INVOKE_MAP, BASE_SEND_MAP, BASE_EVENT_MAP } from './maps.constants';
export { composeMaps } from './compose-maps';
export type { InvokeMap, SendMap, EventMap } from './maps.type';
export type { InvokeApi, SendApi, EventApi, IpcApi, IpcHostApi, StartupInfo, InstanceInfo } from './api.type';
export type { ImportProgress, LogEntryWire, PickedFileWire, SaveFileResultWire } from './payloads.type';
export type { InvokeContract, SendContract, EventContract, IpcNamespaces } from '../augment';
export type { WidgetEventContract, WidgetInvokeContract, WidgetSendContract } from './widget-contract.type';
export type {
  PoppedWidgetWire, StoredPinMode, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeFacts, WidgetProbeRequest, WidgetProbeResult,
  WidgetSettingsWire, WidgetSlice, WidgetSnapLink, WidgetWindowBounds, WidgetWindowGroup, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint,
  WidgetWindowState, WindowGroupAction, WindowGuideMode, WindowGuideState,
} from './widget-window.type';
