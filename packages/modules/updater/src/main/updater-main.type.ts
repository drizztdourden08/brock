/* @layer electron-main @kind types */
import type { UpdateManager } from 'velopack';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { UpdateInfo, UpdaterApi, UpdaterCapabilities, UpdaterPrefs } from '../updater.type';
import type { UpdateFeed } from './update-feed.type';
import type { VersionCandidate } from './update-plan.type';

type VelopackHook = (version: string) => void;

interface VelopackHooks {
  afterInstall?: VelopackHook;
  afterUpdate?: VelopackHook;
  beforeUpdate?: VelopackHook;
  beforeUninstall?: VelopackHook;
  firstRun?: VelopackHook;
  restarted?: VelopackHook;
}

interface UpdaterOptions {
  hooks?: VelopackHooks;
  channel?: string;
  firstCheckDelayMs?: number;
}

interface PrefsStore {
  read: () => Promise<UpdaterPrefs>;
  write: (prefs: UpdaterPrefs) => Promise<void>;
}

interface UpdaterState {
  prefs: UpdaterPrefs;
  available: UpdateInfo | null;
  versions: VersionCandidate[];
}

interface UpdaterRuntime {
  ctx: Pick<MainContext, 'emit' | 'log'>;
  feed: UpdateFeed | null;
  state: UpdaterState;
  manager: () => UpdateManager | null;
}

interface UpdaterMain extends Pick<UpdaterApi, 'check' | 'listVersions' | 'apply' | 'openReleasePage' | 'setPrefs'> {
  capabilities: () => UpdaterCapabilities;
  currentVersion: () => string;
  available: () => UpdateInfo | null;
  getPrefs: () => UpdaterPrefs;
  scheduleFirstCheck: (delayMs: number) => void;
  dispose: () => void;
}

export type {
  VelopackHook, VelopackHooks, UpdaterOptions, PrefsStore, UpdaterRuntime, UpdaterMain,
};
