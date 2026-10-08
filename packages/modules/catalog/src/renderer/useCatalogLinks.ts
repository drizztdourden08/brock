/* @layer renderer-shell @kind logic */
import { useEffect } from 'react';
import type { CatalogLink } from '../catalog.type';
import { catalogApi } from './catalog-api';

const useCatalogLinks = (onLink: (link: CatalogLink) => void): void => {
  useEffect(() => {
    const api = catalogApi();
    if (!api) return undefined;
    let live = true;
    void api.takeLinks().then((links) => { if (live) links.forEach(onLink); });
    const stop = api.onLink(onLink);
    return () => {
      live = false;
      stop();
    };
  }, [onLink]);
};

export { useCatalogLinks };
