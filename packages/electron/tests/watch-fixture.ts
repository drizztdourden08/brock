/* @layer electron-main @kind test */
import { vi } from 'vitest';
import { join } from 'path';
import type { DocumentWatchEvent } from '@drizztdourden08/brock-core/platform';
import type { DocumentAccess, DocumentAccessDeps } from '../src/main/documents/document-access.type';
import type { WatchFn, WatchSignal } from '../src/main/documents/watch-folder.type';
import { makeTree, testAccess } from './folder-fixture';
import { makeAppDir } from './folder-ops-fixture';

interface FakeWatch {
  dir: string;
  recursive: boolean;
  closed: number;
  signal: (kind: WatchSignal, name: string | null) => void;
  fail: () => void;
}

const createFakeWatcher = (fakes: FakeWatch[] = []): { watcher: WatchFn; fakes: FakeWatch[] } => {
  const watcher: WatchFn = (dir, recursive, onSignal, onError) => {
    const fake: FakeWatch = { dir, recursive, closed: 0, signal: onSignal, fail: onError };
    fakes.push(fake);
    return { close: () => { fake.closed += 1; } };
  };
  return { watcher, fakes };
};

interface WatchWorld {
  base: string;
  granted: string;
  outside: string;
  appDir: string;
  fakes: FakeWatch[];
  events: DocumentWatchEvent[];
  listener: (event: DocumentWatchEvent) => void;
  open: (extra?: DocumentAccessDeps) => DocumentAccess;
}

const openWatchWorld = async (prefix: string): Promise<WatchWorld> => {
  const { base, granted, outside } = await makeTree(prefix);
  const appDir = await makeAppDir(granted);
  const fakes: FakeWatch[] = [];
  const events: DocumentWatchEvent[] = [];
  const open = (extra: DocumentAccessDeps = {}): DocumentAccess => {
    fakes.length = 0;
    const fake = createFakeWatcher(fakes);
    const made = testAccess({ protectedRoots: () => [appDir], watcher: fake.watcher, watchMs: 10, ...extra });
    made.allowFolder(granted);
    return made;
  };
  return { base, granted, outside, appDir, fakes, events, listener: (event) => { events.push(event); }, open };
};

const sentinelOf = (granted: string): string => join(granted, 'sentinel');

const settle = async (fake: FakeWatch | undefined, granted: string, events: DocumentWatchEvent[]): Promise<void> => {
  fake?.signal('rename', 'sentinel');
  await vi.waitFor(() => {
    if (!events.some((event) => event.path === sentinelOf(granted))) throw new Error('the watch has not settled');
  });
};

const withoutSentinel = (granted: string, events: DocumentWatchEvent[]): DocumentWatchEvent[] =>
  events.filter((event) => event.path !== sentinelOf(granted));

const pause = (ms: number): Promise<void> => new Promise((done) => setTimeout(done, ms));

export { createFakeWatcher, openWatchWorld, pause, settle, withoutSentinel };
export type { FakeWatch, WatchWorld };
