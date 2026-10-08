/* @layer renderer-shell @kind logic */
import { useCallback, useEffect, useState } from 'react';
import { useJob } from '@drizztdourden08/brock-react';
import { CATALOG_JOB_PREFIX } from '../catalog.constants';
import { requireCatalogApi } from './require-catalog-api';
import type { CatalogItemState } from './catalog-item.type';
import { installedRecordOf } from './installed-record-of';
import { useCatalogInstalled } from './useCatalogInstalled';

const useCatalogItem = (itemId: string, liveVersion: number | null = null): CatalogItemState => {
  const record = useCatalogInstalled(installedRecordOf(itemId));
  const watch = useCatalogInstalled((state) => state.watch);
  const { job, cancel } = useJob(`${CATALOG_JOB_PREFIX}${itemId}`);
  const [error, setError] = useState<string | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  useEffect(watch, [watch]);

  const install = useCallback(async (version: number | null = null) => {
    setError(null);
    const result = await requireCatalogApi().install({ itemId, version });
    if (result.ok) return;
    setSignedOut(result.signedOut);
    setError(result.cancelled ? null : result.error);
  }, [itemId]);

  const uninstall = useCallback(async () => {
    setError(null);
    const result = await requireCatalogApi().uninstall(itemId);
    if (!result.ok) setError(result.error);
  }, [itemId]);

  const running = job?.state === 'running';
  const hasUpdate = record !== null && liveVersion !== null && record.version !== liveVersion;
  return { record, job: running ? job : null, running, hasUpdate, error, signedOut, install, uninstall, cancel };
};

export { useCatalogItem };
