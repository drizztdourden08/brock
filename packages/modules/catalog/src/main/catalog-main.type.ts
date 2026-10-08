/* @layer electron-main @kind types */
import type { CatalogInstallResult, CatalogLink, CatalogUninstallResult, InstalledRecord } from '../catalog.type';
import type { CatalogConfig } from './catalog-config.type';
import type { LinkInbox } from './catalog-links-main.type';
import type { CatalogReads } from './catalog-reads.type';
import type { InstalledRegistry } from './installed-registry.type';

interface CatalogMain {
  configure: (config: CatalogConfig) => void;
  reads: () => CatalogReads;
  install: (link: CatalogLink) => Promise<CatalogInstallResult>;
  uninstall: (itemId: string) => Promise<CatalogUninstallResult>;
  installed: () => Promise<InstalledRecord[]>;
  links: LinkInbox;
  registry: InstalledRegistry;
}

export type { CatalogMain };
