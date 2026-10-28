/* @layer core @kind barrel */
export { BASE_INVOKE_MAP, BASE_SEND_MAP, BASE_EVENT_MAP } from './maps.constants';
export { composeMaps } from './compose-maps';
export { defineChannels } from './define-channels';
export { ask } from './ask-channel';
export { event } from './event-channel';
export { invoke } from './invoke-channel';
export { send } from './send-channel';
export { AppError } from './app-error';
export { isJsonValue } from './is-json-value';
export { isAppError } from './is-app-error';
export { toAppError } from './to-app-error';
export { encodeAppError } from './encode-app-error';
export { decodeAppError } from './decode-app-error';
export type { AppErrorOptions, AppErrorShape, AppErrorWire, JsonValue } from './app-error.type';
export type {
  AnyChannel, AskChannel, AskContractOf, MappedChannelKind, ChannelApi, ChannelDecl, ChannelDecls, ChannelKind, ChannelMaps, ChannelRef, DefinedChannels, EventChannel, EventContractOf, InvokeChannel, InvokeContractOf, InvokeSignature,
  SendChannel, SendContractOf, VoidSignature,
} from './channels.type';
export type { InvokeMap, SendMap, EventMap } from './maps.type';
export type { AppIpcApi, AppIpcMaps, InvokeApi, SendApi, EventApi, IpcApi, IpcHostApi, StartupInfo, InstanceInfo } from './api.type';
export type { AskOutcome, ImportProgress, LogEntryWire, PickedFileWire, QuitDecision, SaveFileResultWire } from './payloads.type';
export type { AskArgs, AskHandler, AskReply } from './ask.type';
export type { InvokeContract, SendContract, EventContract, AskContract, IpcNamespaces } from '../augment';
export type { WidgetEventContract, WidgetInvokeContract, WidgetSendContract } from './widget-contract.type';
export type { DataEventContract, DataInvokeContract, DataSendContract } from './data-contract.type';
export type { DocumentEventContract, DocumentInvokeContract } from './document-contract.type';
export type { PlatformEventContract, PlatformInvokeContract } from './platform-contract.type';
export { PLATFORM_EVENT_MAP, PLATFORM_INVOKE_MAP } from './platform-maps.constants';
export type {
  PoppedWidgetPatch, PoppedWidgetWire, StoredPinMode, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeFacts, WidgetProbeRequest, WidgetProbeResult,
  WidgetSettingsWire, WidgetSlice, WidgetSnapLink, WidgetWindowBounds, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint,
  WidgetWindowState, WindowClusterAction, WindowGuideMode, WindowGuideState,
} from './widget-window.type';
