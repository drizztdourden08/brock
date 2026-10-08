/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogLink } from '../catalog.type';
import { createCatalogLinks } from '../links/catalog-links';
import type { CatalogLinks } from '../links/catalog-links.type';
import type { LinkInbox, OpenSubscribe } from './catalog-links-main.type';

const openSourceOf = (ctx: MainContext): OpenSubscribe | null => {
  const { onOpen } = ctx as MainContext & { onOpen?: OpenSubscribe };
  return typeof onOpen === 'function' ? onOpen : null;
};

const createLinkInbox = (ctx: MainContext): LinkInbox => {
  let pending: CatalogLink[] = [];
  let taken = false;
  let links: CatalogLinks | null = null;

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
    openSourceOf(ctx)?.((request) => {
      if (request.kind === 'url' && request.url) deliverUrl(request.url);
    });
    const launch = links.fromArgv(process.argv);
    if (launch) deliver(launch);
  };

  return { deliver, deliverUrl, take, listen };
};

export { createLinkInbox };
