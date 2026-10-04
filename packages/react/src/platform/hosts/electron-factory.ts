/* @layer renderer-shell @kind logic */
import type {
  DevicePort, FilePickerPort, FileStore, PlatformFactory, StoragePort, WindowControlsPort,
} from '@drizztdourden08/brock-core';
import { osFromProcess } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';

const toArrayBuffer = (data: Uint8Array): ArrayBuffer =>
  data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
    ? (data.buffer as ArrayBuffer)
    : (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);

const createDevice = (): DevicePort => ({
  keepAwake: () => {},
  allowSleep: () => {},
  vibrate: () => {},
  onAppPause: () => () => {},
  onBackButton: () => () => {},
});

const createWindowControls = (): WindowControlsPort => {
  const api = requireHostApi();
  return {
    minimize: () => api.minimize(),
    toggleMaximize: () => api.maximize(),
    close: () => api.close(),
    toggleFullscreen: () => api.toggleFullscreen(),
    setFullscreen: (on) => api.setFullscreen(on),
    setAspectRatioLock: (ratio, extra) => api.setAspectRatioLock(ratio, extra),
    setAlwaysOnTop: (on) => api.setAlwaysOnTop(on),
    openDevTools: () => api.openDevTools(),
    isMaximized: () => api.isMaximized(),
    isFullscreen: () => api.isFullscreen(),
    onMaximizedChange: (cb) => api.onMaximizedChange(cb),
    onFullscreenChange: (cb) => api.onFullscreenChange(cb),
  };
};

const createStorage = (): StoragePort => {
  const api = requireHostApi();
  return {
    getLocation: () => api.getDataLocation(),
    reveal: () => api.revealDataFolder(),
    revealProfile: async (profileId) => (await api.revealProfileFolder(profileId)).success,
    getSummary: () => api.getStorageSummary(),
    revealLogs: () => api.revealLogsFolder(),
  };
};

const createFileStore = (): FileStore => {
  const api = requireHostApi();
  return {
    readBytes: async (path) => {
      const buf = await api.fileReadBytes(path);
      return buf ? new Uint8Array(buf) : null;
    },
    readText: (path) => api.fileReadText(path),
    writeBytes: (path, data) => api.fileWriteBytes(path, toArrayBuffer(data)),
    writeText: (path, data) => api.fileWriteText(path, data),
    list: (dir) => api.fileList(dir),
    remove: (path) => api.fileRemove(path),
    exists: (path) => api.fileExists(path),
    mkdir: (dir) => api.fileMkdir(dir),
    stat: (path) => api.fileStat(path),
  };
};

const createFilePicker = (): FilePickerPort => {
  const api = requireHostApi();
  return {
    pickFile: async (opts) => {
      const picked = await api.pickFile(opts?.extensions ?? []);
      return picked ? { name: picked.name, bytes: new Uint8Array(picked.data) } : null;
    },
    saveFile: ({ name, bytes, extensions }) => api.saveFile(name, toArrayBuffer(bytes), extensions ?? []),
    pickPath: (opts) => api.pickPath(opts?.folder === true, opts?.extensions ?? []),
    pathOf: (file) => api.getFilePath(file) || null,
  };
};

const createElectronFactory = (): PlatformFactory => {
  const api = requireHostApi();
  return {
    info: {
      host: 'electron',
      os: osFromProcess(api.os),
      formFactor: 'desktop',
      input: 'pointer',
      isDev: api.isDev,
    },
    capabilities: {
      windowChrome: true,
      selfUpdate: true,
      nativeFileDialog: true,
      revealDataFolder: true,
      hapticFeedback: false,
    },
    ports: {
      window: createWindowControls,
      storage: createStorage,
      files: createFileStore,
      filePicker: createFilePicker,
      device: createDevice,
    },
  };
};

export { createElectronFactory };
