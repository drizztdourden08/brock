/* @layer core @kind barrel */
export { createPlatform } from './platform';
export { resolvePlatform } from './resolve-platform';
export { withPorts } from './with-ports';
export { detectHost } from './detect';
export { nativePlugin } from './native-plugin';
export { listenNative } from './listen-native';
export type { NativePlugin, NativeListenerHandle } from './native-plugin.type';
export { osFromProcess } from './os-from-process';
export type { Platform, HostShell, OsKind, FormFactor, InputModel, PlatformInfo } from './platform.type';
export type { FactoryMap } from './resolve-platform.type';
export type { PlatformFactory, PortCreators } from './factory.type';
export type { FileStore } from './ports/file-store.type';
export type { FileStat, DataLocation, DataDomainDef, DomainUsage, StorageSummary, StoragePort } from './ports/storage.type';
export type {
  DataExportFormat, DataExportManifest, DataExportResult, DataImportDomain, DataImportMode, DataImportPlan, DataImportResult, DataManifestDomain, DomainCleanResult, DomainEntry,
} from './ports/data-domain.type';
export type { WindowControlsPort, Unsub } from './ports/window-controls.type';
export type { PickedFile, PickPathOptions, SaveFileRequest, SaveFileResult, FilePickerPort } from './ports/file-picker.type';
export type { DevicePort, BackEdge } from './ports/device.type';
export type { Capabilities, PlatformPorts } from '../augment';
