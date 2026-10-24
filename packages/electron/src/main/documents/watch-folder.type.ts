/* @layer electron-main @kind types */
import type { DocumentWatchEvent } from '@drizztdourden08/brock-core/platform';

type WatchSignal = 'rename' | 'change';

interface WatchHandle {
  close: () => void;
}

type WatchFn = (dir: string, recursive: boolean, onSignal: (signal: WatchSignal, name: string | null) => void, onError: () => void) => WatchHandle;

interface WatchSettings {
  dir: string;
  recursive: boolean;
  ms: number;
  max: number;
  watcher: WatchFn;
  check: (path: string) => Promise<boolean>;
  live: () => boolean;
  listener: (event: DocumentWatchEvent) => void;
}

export type { WatchFn, WatchSettings, WatchSignal };
