/* @layer core @kind types */
import type {
  CatalogApi, CatalogInstallResult, CatalogItem, CatalogLink, CatalogListQuery, CatalogResult, CatalogUninstallResult, InstalledRecord,
} from './catalog.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'catalog:home': () => Promise<CatalogResult<unknown>>;
    'catalog:list': (query?: CatalogListQuery) => Promise<CatalogResult<CatalogItem[]>>;
    'catalog:item': (itemId: string) => Promise<CatalogResult<CatalogItem>>;
    'catalog:installed': () => Promise<InstalledRecord[]>;
    'catalog:install': (link: CatalogLink) => Promise<CatalogInstallResult>;
    'catalog:uninstall': (itemId: string) => Promise<CatalogUninstallResult>;
    'catalog:takeLinks': () => Promise<CatalogLink[]>;
  }

  interface EventContract {
    'catalog:link': (link: CatalogLink) => void;
    'catalog:changed': () => void;
  }

  interface IpcNamespaces {
    catalog: CatalogApi;
  }
}
