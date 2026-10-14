/* @layer renderer-shell @kind logic */
import { moduleTabId } from './module-tab-id';
import type { TabDef } from './settings.type';

const separateModuleTabs = <S extends object>(tabs: readonly TabDef<S>[], taken: ReadonlySet<string> = new Set()): TabDef<S>[] => {
  const used = new Set(taken);
  return tabs.map((tab) => {
    const id = tab.moduleId !== undefined && used.has(tab.id) ? moduleTabId(tab.moduleId, tab.id) : tab.id;
    used.add(id);
    return id === tab.id ? tab : { ...tab, id };
  });
};

export { separateModuleTabs };
