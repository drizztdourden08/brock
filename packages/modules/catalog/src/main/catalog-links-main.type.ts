/* @layer electron-main @kind types */
import type { CatalogLink } from '../catalog.type';

interface OpenUrlRequest {
  kind: string;
  url?: string;
}

type OpenSubscribe = (handler: (request: OpenUrlRequest) => void) => () => void;

interface LinkInbox {
  deliver: (link: CatalogLink) => void;
  deliverUrl: (url: string) => boolean;
  take: () => CatalogLink[];
  listen: (scheme: string) => void;
}

export type { OpenSubscribe, LinkInbox };
