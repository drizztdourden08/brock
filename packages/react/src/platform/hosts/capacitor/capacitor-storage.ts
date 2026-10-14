/* @layer renderer-shell @kind logic */
import type { DataLocation, StoragePort } from '@drizztdourden08/brock-core';
import { capacitorPlugins } from './capacitor-plugins';
import { DATA_DIRECTORY } from './capacitor.constants';

const locationOf = async (): Promise<DataLocation> => {
  const found = await capacitorPlugins.files()?.getUri({ path: '', directory: DATA_DIRECTORY }).catch(() => null);
  return { path: found?.uri ?? '', osLabel: capacitorPlugins.platform() === 'ios' ? 'iOS (app storage)' : 'Android (app storage)', canReveal: false };
};

const createCapacitorStorage = (): StoragePort => ({
  getLocation: locationOf,
  reveal: () => Promise.resolve(),
  revealProfile: () => Promise.resolve(false),
  getSummary: async () => ({ location: await locationOf(), domains: [], totalBytes: 0 }),
});

export { createCapacitorStorage };
