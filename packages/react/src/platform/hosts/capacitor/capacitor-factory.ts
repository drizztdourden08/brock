/* @layer renderer-shell @kind logic */
import type { OsKind, PlatformFactory } from '@drizztdourden08/brock-core';
import { capacitorPlugins } from './capacitor-plugins';
import { createCapacitorDevice } from './capacitor-device';
import { createCapacitorFilePicker } from './capacitor-file-picker';
import { createCapacitorFileStore } from './capacitor-file-store';
import { createCapacitorStorage } from './capacitor-storage';
import { createCapacitorWindow } from './capacitor-window';

const osOf = (platform: string): OsKind => (platform === 'android' || platform === 'ios' ? platform : 'unknown');

const createCapacitorFactory = (): PlatformFactory => ({
  info: { host: 'capacitor', os: osOf(capacitorPlugins.platform()), formFactor: 'mobile', input: 'touch', isDev: false },
  capabilities: {
    windowChrome: false,
    titleBar: true,
    selfUpdate: false,
    nativeFileDialog: false,
    revealDataFolder: false,
    hapticFeedback: capacitorPlugins.haptics() !== null,
  },
  ports: {
    window: createCapacitorWindow,
    storage: createCapacitorStorage,
    files: createCapacitorFileStore,
    filePicker: createCapacitorFilePicker,
    device: createCapacitorDevice,
  },
});

export { createCapacitorFactory };
