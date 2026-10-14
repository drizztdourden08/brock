/* @layer renderer-shell @kind types */
import type { NativeListenerHandle } from '@drizztdourden08/brock-core';

type Listen = (eventName: string, listener: (data: never) => void) => NativeListenerHandle | Promise<NativeListenerHandle>;

interface FsEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  mtime?: number;
}

interface FsTarget {
  path: string;
  directory: string;
}

interface FilesystemPlugin {
  addListener: Listen;
  readFile: (options: FsTarget & { encoding?: string }) => Promise<{ data: string | Blob }>;
  writeFile: (options: FsTarget & { data: string; encoding?: string; recursive?: boolean }) => Promise<unknown>;
  readdir: (options: FsTarget) => Promise<{ files: FsEntry[] }>;
  stat: (options: FsTarget) => Promise<FsEntry>;
  mkdir: (options: FsTarget & { recursive?: boolean }) => Promise<void>;
  rmdir: (options: FsTarget & { recursive?: boolean }) => Promise<void>;
  deleteFile: (options: FsTarget) => Promise<void>;
  getUri: (options: FsTarget) => Promise<{ uri: string }>;
}

interface AppPlugin {
  addListener: Listen;
  exitApp: () => Promise<void>;
}

interface HapticsPlugin {
  addListener: Listen;
  vibrate: (options: { duration: number }) => Promise<void>;
}

interface KeepAwakePlugin {
  addListener: Listen;
  keepAwake: () => Promise<void>;
  allowSleep: () => Promise<void>;
}

interface CapacitorCore {
  getPlatform?: () => string;
}

export type { AppPlugin, CapacitorCore, FilesystemPlugin, FsEntry, FsTarget, HapticsPlugin, KeepAwakePlugin };
