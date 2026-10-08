/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogInstallResult, CatalogLink, CatalogUninstallResult } from '../catalog.type';
import { createCatalogClient } from './catalog-client';
import { createLinkInbox } from './catalog-links-main';
import type { CatalogMain } from './catalog-main.type';
import { createCatalogReads } from './catalog-reads';
import { failureOf } from './failure-of';
import { installItem } from './install-item';
import type { InstallDeps } from './install-item.type';
import { createInstalledRegistry } from './installed-registry';
import { uninstallItem } from './uninstall-item';

const instances = new WeakMap<MainContext, CatalogMain>();

const createCatalogMain = (ctx: MainContext): CatalogMain => {
  const registry = createInstalledRegistry(ctx.files);
  const links = createLinkInbox(ctx);
  let deps: InstallDeps | null = null;

  const ready = (): InstallDeps => {
    if (!deps) throw new Error('The catalog module has no catalogue yet: call configureCatalog(ctx, config) from the app\'s onReady or services.');
    return deps;
  };

  const install = async (link: CatalogLink): Promise<CatalogInstallResult> => {
    try {
      const record = await installItem(ready(), link);
      ctx.emit('catalog:changed');
      return { ok: true, record };
    } catch (error) {
      return { ...failureOf(error), cancelled: error instanceof Error && error.name === 'AbortError' };
    }
  };

  const uninstall = async (itemId: string): Promise<CatalogUninstallResult> => {
    try {
      const released = await uninstallItem(ready(), itemId);
      ctx.emit('catalog:changed');
      return { ok: true, released };
    } catch (error) {
      return { ok: false, error: failureOf(error).error };
    }
  };

  return {
    configure: (config) => {
      deps = { ctx, config, registry, reads: createCatalogReads(config, createCatalogClient(config.endpoint)) };
      if (config.linkScheme) links.listen(config.linkScheme);
    },
    reads: () => ready().reads,
    install,
    uninstall,
    installed: () => registry.list(),
    links,
    registry,
  };
};

const getCatalog = (ctx: MainContext): CatalogMain => {
  const existing = instances.get(ctx);
  if (existing) return existing;
  const created = createCatalogMain(ctx);
  instances.set(ctx, created);
  return created;
};

export { getCatalog };
