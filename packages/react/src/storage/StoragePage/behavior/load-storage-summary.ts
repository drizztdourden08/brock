/* @layer renderer-shell @kind logic */
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import { getPlatform } from '../../../platform/get-platform';
import { dataDomainsState } from '../../data-domains-state';
import type { StorageSummaryView } from '../StoragePage.type';

const loadStorageSummary = async (keep: (list: readonly DataDomainDef[]) => DataDomainDef[]): Promise<StorageSummaryView> => {
  const summary = await getPlatform().storage.getSummary();
  const domains = keep(dataDomainsState.domains);
  const usage = Object.fromEntries(summary.domains.filter((entry) => domains.some((def) => def.domain === entry.domain)).map((entry) => [entry.domain, entry]));
  return { domains, location: summary.location, usage };
};

export { loadStorageSummary };
