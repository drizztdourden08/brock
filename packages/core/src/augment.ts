/* @layer core @kind types */
import type { FileStat, DataLocation, StorageSummary, StoragePort } from './platform/ports/storage.type';
import type { SystemDiagnostics } from './types/diagnostics.type';
import type { PlaySession } from './types/session.type';
import type { Result } from './result/result.type';
import type { ImportProgress, LogEntryWire, PickedFileWire, SaveFileResultWire } from './ipc/payloads.type';
import type { WindowControlsPort } from './platform/ports/window-controls.type';
import type { FileStore } from './platform/ports/file-store.type';
import type { FilePickerPort } from './platform/ports/file-picker.type';
import type { DevicePort } from './platform/ports/device.type';
import type { ReviewCheck } from './review/review.type';
import type { BootFailure, BootProgress } from './boot/boot-task.type';

interface BaseProfile {
  id: string;
  name: string;
  created: number;
  lastPlayed: number;
  automation?: boolean;
}
interface ProfileExtension {}
interface ProfileCreateExtension {}
interface ProfilePatchExtension {}
type Profile = BaseProfile & ProfileExtension;
type CreateProfileOptions = { name: string; initialConfig?: Record<string, unknown> } & ProfileCreateExtension;
type ProfilePatch = { name?: string } & ProfilePatchExtension;

interface InvokeContract {
  'app:getUserDataPath': () => Promise<string>;
  'app:getVersion': () => Promise<string>;
  'diagnostics:getSystem': () => Promise<SystemDiagnostics>;

  'storage:getLocation': () => Promise<DataLocation>;
  'storage:reveal': () => Promise<void>;
  'storage:revealProfile': (profileId: string) => Promise<Result>;
  'storage:getSummary': () => Promise<StorageSummary>;

  'file:readBytes': (path: string) => Promise<ArrayBuffer | null>;
  'file:readText': (path: string) => Promise<string | null>;
  'file:writeBytes': (path: string, data: ArrayBuffer) => Promise<void>;
  'file:writeText': (path: string, data: string) => Promise<void>;
  'file:list': (dir: string) => Promise<string[]>;
  'file:remove': (path: string) => Promise<void>;
  'file:exists': (path: string) => Promise<boolean>;
  'file:mkdir': (dir: string) => Promise<void>;
  'file:stat': (path: string) => Promise<FileStat | null>;

  'window:isMaximized': () => Promise<boolean>;
  'window:setAlwaysOnTop': (value: boolean) => Promise<boolean>;
  'window:isFullscreen': () => Promise<boolean>;

  'dialog:pickFile': (extensions: string[]) => Promise<PickedFileWire | null>;
  'dialog:saveFile': (name: string, data: ArrayBuffer, extensions: string[]) => Promise<SaveFileResultWire>;

  'profiles:list': () => Promise<Profile[]>;
  'profiles:create': (opts: CreateProfileOptions) => Promise<Profile>;
  'profiles:delete': (id: string) => Promise<void>;
  'profiles:setLast': (id: string) => Promise<void>;
  'profiles:getAppState': () => Promise<{ lastProfileId: string | null }>;
  'profiles:updateLastPlayed': (id: string) => Promise<void>;
  'profiles:update': (id: string, patch: ProfilePatch) => Promise<Profile | null>;

  'config:read': (profileId: string) => Promise<Record<string, unknown> | null>;
  'config:write': (profileId: string, settings: Record<string, unknown>) => Promise<void>;

  'sessions:list': (profileId: string) => Promise<PlaySession[]>;
  'sessions:save': (profileId: string, session: PlaySession) => Promise<void>;

  'uiViews:load': () => Promise<Record<string, unknown>>;
  'uiViews:save': (data: Record<string, unknown>) => Promise<void>;

  'test:screenshot': (name: string) => Promise<string>;
  'review:capture': (step: string) => Promise<string>;
}

interface SendContract {
  'window:minimize': () => void;
  'window:maximize': () => void;
  'window:close': () => void;
  'window:openDevTools': () => void;
  'window:toggleFullscreen': () => void;
  'window:setFullscreen': (value: boolean) => void;
  'window:setAspectRatioLock': (ratio: number, extraHeight: number) => void;
  'boot:progress': (progress: BootProgress) => void;
  'boot:failed': (failure: BootFailure) => void;
  'boot:ready': () => void;
  'debug:appendSessionLog': (lines: string[]) => void;
  'review:check': (check: ReviewCheck) => void;
  'review:finish': () => void;
}

interface EventContract {
  'window:maximized': (maximized: boolean) => void;
  'window:fullscreen': (fullscreen: boolean) => void;
  'log:entry': (entry: LogEntryWire) => void;
  'import:progress': (progress: ImportProgress) => void;
}

interface IpcNamespaces {}

interface Capabilities {
  windowChrome: boolean;
  selfUpdate: boolean;
  nativeFileDialog: boolean;
  revealDataFolder: boolean;
  hapticFeedback: boolean;
}

interface PlatformPorts {
  window: WindowControlsPort;
  storage: StoragePort;
  files: FileStore;
  filePicker: FilePickerPort;
  device: DevicePort;
}

export type {
  BaseProfile, ProfileExtension, ProfileCreateExtension, ProfilePatchExtension,
  Profile, CreateProfileOptions, ProfilePatch,
  InvokeContract, SendContract, EventContract, IpcNamespaces,
  Capabilities, PlatformPorts,
};
