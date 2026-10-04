/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { DataDomainDef, DataLocation, DomainUsage } from '@drizztdourden08/brock-core';
import { hostApi } from '../../../host/host-api';
import type { StorageDomainsState } from '../StoragePage.type';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const useStorageDomains = (only?: readonly string[]): StorageDomainsState => {
  const api = hostApi();
  const [domains, setDomains] = useState<DataDomainDef[]>([]);
  const [location, setLocation] = useState<DataLocation | null>(null);
  const [usage, setUsage] = useState<Partial<Record<string, DomainUsage>>>({});
  const [error, setError] = useState<string | null>(null);
  const filter = only?.join('\n');

  const measure = useCallback((domain: string) => {
    if (!api) return;
    setUsage((prev) => ({ ...prev, [domain]: undefined }));
    api.getDomainUsage(domain).then((next) => setUsage((prev) => ({ ...prev, [domain]: next })), (err: unknown) => setError(messageOf(err)));
  }, [api]);

  const load = useCallback(() => {
    if (!api) return;
    setError(null);
    Promise.all([api.listDataDomains(), api.getDataLocation()]).then(([list, where]) => {
      const keep = filter === undefined ? list : list.filter((def) => filter.split('\n').includes(def.domain));
      setDomains(keep);
      setLocation(where);
      for (const def of keep) measure(def.domain);
    }, (err: unknown) => setError(messageOf(err)));
  }, [api, filter, measure]);

  useEffect(load, [load]);

  const refresh = useCallback((domain?: string) => (domain === undefined ? load() : measure(domain)), [load, measure]);
  return { available: api !== null, location, domains, usage, error, refresh };
};

export { useStorageDomains };
