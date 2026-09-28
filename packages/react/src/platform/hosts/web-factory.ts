/* @layer renderer-shell @kind logic */
import type {
  DevicePort, FilePickerPort, FileStore, PlatformFactory, StoragePort, WindowControlsPort,
} from '@drizztdourden08/brock-core';
import { EMPTY_SUMMARY } from './web-factory.constants';

const noopUnsub = () => () => {};
const resolveFalse = () => Promise.resolve(false);
const resolveNull = () => Promise.resolve(null);

const wakeLockOf = (nav: Navigator): WakeLock | undefined => ('wakeLock' in nav ? nav.wakeLock : undefined);

const tryVibrate = (durationMs: number): boolean => {
  try {
    return navigator.vibrate(Math.max(1, Math.round(durationMs)));
  } catch {
    return false;
  }
};

const createDevice = (): DevicePort => {
  let wakeLock: WakeLockSentinel | null = null;
  return {
    keepAwake: () => {
      wakeLockOf(navigator)?.request('screen').then((lock) => { wakeLock = lock; }).catch(() => {});
    },
    allowSleep: () => { wakeLock?.release().catch(() => {}); wakeLock = null; },
    vibrate: (durationMs) => { tryVibrate(durationMs); },
    onAppPause: (cb) => {
      const handler = () => { if (document.visibilityState === 'hidden') cb(); };
      document.addEventListener('visibilitychange', handler);
      return () => document.removeEventListener('visibilitychange', handler);
    },
    onBackButton: () => () => {},
  };
};

const createWindowControls = (): WindowControlsPort => ({
  minimize: () => {},
  toggleMaximize: () => {},
  close: () => {},
  toggleFullscreen: () => {},
  setFullscreen: () => {},
  setAspectRatioLock: () => {},
  setAlwaysOnTop: resolveFalse,
  openDevTools: () => {},
  isMaximized: resolveFalse,
  isFullscreen: resolveFalse,
  onMaximizedChange: noopUnsub,
  onFullscreenChange: noopUnsub,
});

const createStorage = (): StoragePort => ({
  getLocation: () => Promise.resolve(EMPTY_SUMMARY.location),
  reveal: async () => {},
  revealProfile: resolveFalse,
  getSummary: () => Promise.resolve(EMPTY_SUMMARY),
});

const createFileStore = (): FileStore => ({
  readBytes: resolveNull,
  readText: resolveNull,
  writeBytes: async () => {},
  writeText: async () => {},
  list: () => Promise.resolve([]),
  remove: async () => {},
  exists: resolveFalse,
  mkdir: async () => {},
  stat: resolveNull,
});

const createFilePicker = (): FilePickerPort => ({
  pickFile: (opts) => new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (opts?.extensions?.length) input.accept = opts.extensions.map((e) => `.${e}`).join(',');
    input.onchange = async () => {
      const file = input.files?.[0];
      resolve(file ? { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) } : null);
    };
    input.click();
  }),
  saveFile: ({ name, bytes }) => {
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    return Promise.resolve({ saved: true, name });
  },
});

const createWebFactory = (): PlatformFactory => ({
  info: { host: 'web', os: 'unknown', formFactor: 'desktop', input: 'pointer', isDev: false },
  capabilities: {
    windowChrome: false,
    selfUpdate: false,
    nativeFileDialog: false,
    revealDataFolder: false,
    hapticFeedback: false,
  },
  ports: {
    window: createWindowControls,
    storage: createStorage,
    files: createFileStore,
    filePicker: createFilePicker,
    device: createDevice,
  },
});

export { createWebFactory };
