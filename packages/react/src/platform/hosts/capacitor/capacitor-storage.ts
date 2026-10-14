/* @layer renderer-shell @kind logic */
import type { DataLocation, StoragePort, StorageSummary } from '@drizztdourden08/brock-core';
import { dataDomainsState } from '../../../storage/data-domains-state';
import { capacitorPlugins } from './capacitor-plugins';
import { DATA_DIRECTORY } from './capacitor.constants';
import { measureCapacitorDomain } from './measure-capacitor-domain';

const locationOf = async (): Promise<DataLocation> => {
  const found = await capacitorPlugins.files()?.getUri({ path: '', directory: DATA_DIRECTORY }).catch(() => null);
  return { path: found?.uri ?? '', osLabel: capacitorPlugins.platform() === 'ios' ? 'iOS (app storage)' : 'Android (app storage)', canReveal: false };
};

const summaryOf = async (): Promise<StorageSummary> => {
  const files = capacitorPlugins.files();
  const domains = files ? await Promise.all(dataDomainsState.domains.map((def) => measureCapacitorDomain(files, def))) : [];
  return { location: await locationOf(), domains, totalBytes: domains.reduce((sum, usage) => sum + usage.bytes, 0) };
};

const createCapacitorStorage = (): StoragePort => ({
  getLocation: locationOf,
  reveal: () => Promise.resolve(),
  revealProfile: () => Promise.resolve(false),
  getSummary: summaryOf,
});

export { createCapacitorStorage };
