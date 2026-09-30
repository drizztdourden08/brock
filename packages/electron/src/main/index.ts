/* @layer electron-main @kind barrel */
export { bootstrapApp } from './bootstrap/bootstrap-app';
export type {
  MainContext, MainModule, HandlerGroup, BootstrapOptions, BootstrapPaths, SecurityOptions,
  InstanceInfo, MainPaths, MainLogLevel, EmitToWindow,
} from './types/main-context.type';

export { handle } from './ipc/handle';
export { on } from './ipc/on';
export { emit } from './ipc/emit';
export type { HandleFn, OnFn, EmitFn, InvokeHandler, SendHandler } from './ipc/handle.type';

export { initPaths } from './paths/init-paths';
export { getUserDataPath } from './paths/get-user-data-path';
export { getLegacyPath } from './paths/get-legacy-path';
export { ensureDataDirectories } from './paths/ensure-data-directories';
export { createNodeFileStore } from './files/node-file-store';
export { resolveDataPath } from './files/resolve-data-path';
export { readJsonFile } from './files/read-json-file';
export { writeJsonFile } from './files/write-json-file';
export { toArrayBuffer } from './files/to-array-buffer';
export { toArrayBufferOrNull } from './files/to-array-buffer-or-null';
export { appendMainLog } from './logs/append-main-log';
export { appendMainLogSync } from './logs/append-main-log-sync';
export { mainLogPath } from './logs/main-log-path';
export { createRendererLogger } from './logs/renderer-log';
export type { RendererLogger, RendererLogLevel } from './logs/renderer-log.type';

export { applyPortableMode } from './app/portable-mode';
export { installRoot } from './app/install-root';
export { applyUserDataArg } from './app/user-data-arg';
export { parseInstanceConfig } from './instance/instance-config';
export { isInstanceLaunch } from './instance/is-instance-launch';

export { getMainWindow } from './window/get-main-window';
export { defineBootTask } from './boot/define-boot-task';
export { whenRevealed } from './boot/when-revealed';
export type { MainBootContext, MainBootTask, MainBootTaskDef } from './boot/boot-state.type';
export { DEFAULT_PERMISSIONS, DEFAULT_EXTERNAL_PROTOCOLS } from './window/security.constants';
export { captureWindow } from './handlers/capture-window';
export { collectSystemDiagnostics } from './diagnostics/collect-system-diagnostics';

export { serveDirectoryScheme } from './protocol/serve-directory-scheme';
export { servedFilePathOf } from './protocol/served-file-path-of';
export { registerPrivilegedSchemes } from './protocol/privileged-schemes';
export { note } from './crash-forensics/note';
export { noteSync } from './crash-forensics/note-sync';
export { stackOf } from './crash-forensics/stack-of';
