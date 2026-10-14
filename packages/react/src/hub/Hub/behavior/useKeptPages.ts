/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { HubPage, HubRenderContext } from '../../hub.type';
import type { KeptPage } from '../Hub.type';

const useKeptPages = (page: HubPage, context: HubRenderContext): KeptPage[] => {
  const [kept, setKept] = useState<ReadonlyMap<string, HubRenderContext>>(() => new Map());

  useEffect(() => {
    if (page.keepMounted === true) setKept((prev) => new Map(prev).set(page.id, context));
  }, [page, context]);

  const listed: KeptPage[] = [...kept].map(([id, last]) => (id === page.id ? { id, context, shown: true } : { id, context: last, shown: false }));
  return page.keepMounted === true && !kept.has(page.id) ? [...listed, { id: page.id, context, shown: true }] : listed;
};

export { useKeptPages };
