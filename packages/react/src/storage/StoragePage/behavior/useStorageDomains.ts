/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { detectHost } from '@drizztdourden08/brock-core';
import type { DataDomainDef, DataLocation, DomainUsage } from '@drizztdourden08/brock-core';
import { hostApi } from '../../../host/host-api';
import type { StorageDomainsState, StorageFailure } from '../StoragePage.type';
import { loadStorageSummary } from './load-storage-summary';

const useStorageDomains = (only?: readonly string[]): StorageDomainsState => {
  const summaryOnly = detectHost() === 'capacitor';
  const api = summaryOnly ? null : hostApi();
  const [domains, setDomains] = useState<DataDomainDef[]>([]);
  const [location, setLocation] = useState<DataLocation | null>(null);
  const [usage, setUsage] = useState<Partial<Record<string, DomainUsage>>>({});
  const [failure, setFailure] = useState<StorageFailure | null>(null);
  const [loading, setLoading] = useState(false);
  const filter = only?.join('\n');

  const measure = useCallback((domain: string) => {
    if (!api) return;
    setUsage((prev) => ({ ...prev, [domain]: undefined }));
    api.getDomainUsage(domain).then((next) => setUsage((prev) => ({ ...prev, [domain]: next })), (error: unknown) => setFailure({ error }));
  }, [api]);

  const load = useCallback(() => {
    const keep = (list: readonly DataDomainDef[]): DataDomainDef[] =>
      (filter === undefined ? [...list] : list.filter((def) => filter.split('\n').includes(def.domain)));
    setFailure(null);
    if (summaryOnly) {
      setLoading(true);
      loadStorageSummary(keep).then((summary) => {
        setDomains(summary.domains);
        setLocation(summary.location);
        setUsage(summary.usage);
      }, (error: unknown) => setFailure({ error })).finally(() => setLoading(false));
      return;
    }
    if (!api) return;
    setLoading(true);
    Promise.all([api.listDataDomains(), api.getDataLocation()]).then(([list, where]) => {
      setDomains(keep(list));
      setLocation(where);
      for (const def of keep(list)) measure(def.domain);
    }, (error: unknown) => setFailure({ error })).finally(() => setLoading(false));
  }, [api, filter, measure, summaryOnly]);

  useEffect(load, [load]);

  const refresh = useCallback((domain?: string) => (domain === undefined || summaryOnly ? load() : measure(domain)), [load, measure, summaryOnly]);
  return { available: api !== null || summaryOnly, manage: !summaryOnly, location, domains, usage, failure, loading, refresh };
};

export { useStorageDomains };
