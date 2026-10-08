/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import { catalogApi } from './catalog-api';
import type { CatalogInstalledState } from './catalog-installed.type';

let watching = false;

const useCatalogInstalled = create<CatalogInstalledState>((set, get) => ({
  records: [],
  reload: async () => {
    set({ records: (await catalogApi()?.installed()) ?? [] });
  },
  watch: () => {
    if (watching) return;
    watching = true;
    void get().reload();
    catalogApi()?.onChanged(() => { void get().reload(); });
  },
}));

export { useCatalogInstalled };
