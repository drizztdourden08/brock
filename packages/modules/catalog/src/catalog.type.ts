/* @layer core @kind types */
interface CatalogItem {
  id: string;
  [field: string]: unknown;
}

interface CatalogPage<Item = CatalogItem> {
  items: Item[];
  nextCursor: string | null;
}

interface CatalogGrant {
  itemId: string;
  version: number;
  label: string;
  url: string;
  bytes: number;
  sha256: string;
  container: string;
  kind?: string | null;
  meta?: Record<string, unknown>;
}

interface InstalledRecord {
  itemId: string;
  version: number;
  label: string;
  container: string;
  kind: string | null;
  installedName: string;
  installedAt: number;
  meta: Record<string, unknown>;
}

interface CatalogLink {
  itemId: string;
  version: number | null;
}

type CatalogFailure = { ok: false; error: string; signedOut: boolean };

type CatalogResult<T> = { ok: true; data: T } | CatalogFailure;

type CatalogInstallResult = { ok: true; record: InstalledRecord } | (CatalogFailure & { cancelled: boolean });

type CatalogUninstallResult = { ok: true; released: number } | { ok: false; error: string };

interface CatalogListQuery {
  kind?: string | null;
  [field: string]: string | number | boolean | null | undefined;
}

interface CatalogApi {
  home: () => Promise<CatalogResult<unknown>>;
  list: (query?: CatalogListQuery) => Promise<CatalogResult<CatalogItem[]>>;
  item: (itemId: string) => Promise<CatalogResult<CatalogItem>>;
  installed: () => Promise<InstalledRecord[]>;
  install: (link: CatalogLink) => Promise<CatalogInstallResult>;
  uninstall: (itemId: string) => Promise<CatalogUninstallResult>;
  takeLinks: () => Promise<CatalogLink[]>;
  onLink: (listener: (link: CatalogLink) => void) => () => void;
  onChanged: (listener: () => void) => () => void;
}

export type {
  CatalogItem, CatalogPage, CatalogGrant, InstalledRecord, CatalogLink, CatalogFailure, CatalogResult, CatalogInstallResult, CatalogUninstallResult,
  CatalogListQuery, CatalogApi,
};
