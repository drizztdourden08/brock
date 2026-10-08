/* @layer electron-main @kind types */
import type { CatalogLink } from '../catalog.type';

interface LinkInbox {
  deliver: (link: CatalogLink) => void;
  deliverUrl: (url: string) => boolean;
  take: () => CatalogLink[];
  listen: (scheme: string) => void;
}

export type { LinkInbox };
