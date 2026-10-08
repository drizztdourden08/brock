/* @layer electron-main @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { CatalogGrant, CatalogItem, CatalogPage, InstalledRecord } from '../catalog.type';

type CatalogParse<T> = (value: unknown) => T;

type CatalogMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface CatalogRoute {
  method: CatalogMethod;
  path: string;
}

interface CatalogRoutes {
  home: CatalogRoute;
  list: CatalogRoute;
  item: CatalogRoute;
  grant: CatalogRoute;
}

interface CatalogEndpoint {
  baseUrl: string;
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
  fetch?: typeof fetch;
  onUnauthorized?: () => void | Promise<void>;
}

interface CatalogSchema<Item = CatalogItem, Home = unknown> {
  item: CatalogParse<Item>;
  page: CatalogParse<CatalogPage<Item>>;
  home?: CatalogParse<Home>;
  grant?: CatalogParse<CatalogGrant>;
}

interface InstallInput {
  file: string;
  grant: CatalogGrant;
  files: FileStore;
  report: (done: number, total: number | null) => void;
}

interface InstallOutcome {
  installedName: string;
  ownName?: string;
}

interface CatalogInstaller {
  install: (input: InstallInput) => Promise<InstallOutcome>;
  uninstall: (record: InstalledRecord, files: FileStore) => Promise<void>;
  settleName?: (installedName: string, ownName: string, files: FileStore) => Promise<string>;
}

interface CatalogHooks {
  onRelease?: (record: InstalledRecord, replacement: string | null, ctx: MainContext) => number | void | Promise<number | void>;
  onInstalled?: (record: InstalledRecord, ctx: MainContext) => void | Promise<void>;
  onUninstalled?: (record: InstalledRecord, ctx: MainContext) => void | Promise<void>;
}

interface CatalogConfig<Item = CatalogItem, Home = unknown> extends CatalogHooks {
  label: string;
  endpoint: CatalogEndpoint;
  schema: CatalogSchema<Item, Home>;
  installers: Record<string, CatalogInstaller>;
  routes?: Partial<CatalogRoutes>;
  maxBytes?: number | ((grant: CatalogGrant) => number);
  linkScheme?: string;
  maxPages?: number;
}

type CatalogGrantRules = Pick<CatalogConfig, 'maxBytes' | 'installers' | 'label'>;

export type {
  CatalogGrantRules, CatalogParse, CatalogMethod, CatalogRoute, CatalogRoutes, CatalogEndpoint, CatalogSchema, InstallInput, InstallOutcome, CatalogInstaller, CatalogHooks,
  CatalogConfig,
};
