/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogLink } from '../catalog.type';
import { createCatalogLinks } from '../links/catalog-links';
import type { CatalogLinks } from '../links/catalog-links.type';
import type { LinkInbox } from './catalog-links-main.type';

const createLinkInbox = (ctx: MainContext): LinkInbox => {
  let pending: CatalogLink[] = [];
  let taken = false;
  let links: CatalogLinks | null = null;
  let stop: (() => void) | null = null;

  const deliver = (link: CatalogLink): void => {
    if (taken) ctx.emit('catalog:link', link);
    else pending.push(link);
  };

  const deliverUrl = (url: string): boolean => {
    const link = links?.parse(url) ?? null;
    if (link) deliver(link);
    return link !== null;
  };

  const take = (): CatalogLink[] => {
    taken = true;
    const out = pending;
    pending = [];
    return out;
  };

  const listen = (scheme: string): void => {
    links = createCatalogLinks(scheme);
    stop?.();
    stop = ctx.onOpen((request) => {
      if (request.kind === 'url' && request.scheme === scheme) deliverUrl(request.url);
    });
  };

  return { deliver, deliverUrl, take, listen };
};

export { createLinkInbox };
