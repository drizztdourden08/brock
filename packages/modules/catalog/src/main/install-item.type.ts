/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogConfig } from './catalog-config.type';
import type { CatalogReads } from './catalog-reads.type';
import type { InstalledRegistry } from './installed-registry.type';

interface InstallDeps {
  ctx: MainContext;
  config: CatalogConfig;
  reads: CatalogReads;
  registry: InstalledRegistry;
}

export type { InstallDeps };
