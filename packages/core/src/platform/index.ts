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
export type { WindowCloseOptions, WindowControlsPort, Unsub } from './ports/window-controls.type';
export { anyTypeFor } from './any-type-for';
export { CLIPBOARD_PNG, CLIPBOARD_TEXT } from './clipboard-types.constants';
export { privateClipboardType } from './private-clipboard-type';
export { isPrivateClipboardType } from './is-private-clipboard-type';
export { privateClipboardPrefix } from './private-clipboard-prefix';
export type { ClipboardEntries, ClipboardPort, ClipboardValue, ClipboardWireEntries, ClipboardWireValue } from './ports/clipboard.type';
export type { NetPort, NetReadOptions, NetReadResult, NetReadWire } from './ports/net.type';
export type { AnyTypeScope, AnyTypeOption, PickedFile, PickFileOptions, PickPathOptions, SaveFileRequest, SaveFileResult, FilePickerPort } from './ports/file-picker.type';
export type { DocumentCopyOptions, DocumentFileOperations, DocumentDialogOptions, DocumentDropKind, DocumentDropResult, DocumentEntry, DocumentEntryKind, DocumentFilter, DocumentFolderAsk, DocumentFolderOptions, DocumentGrantFolder, DocumentGrantingOptions, DocumentPick, DocumentPicker, DocumentListing, DocumentListOptions, DocumentMkdirOptions, DocumentRenameOptions, DocumentRevealResult, DocumentsPort, DocumentWatchEvent, DocumentWatchKind, DocumentWatchListener, DocumentWatchOptions, DocumentWriteOptions, RecentDocument, RememberedFolder, RecoverableSnapshot, SnapshotMeta, SnapshotWrite } from './ports/documents.type';
export type { DevicePort, BackEdge } from './ports/device.type';
export type { Capabilities, PlatformPorts, ShowFlags } from '../augment';
