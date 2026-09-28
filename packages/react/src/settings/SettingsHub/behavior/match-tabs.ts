/* @layer renderer-shell @kind logic */
import type { TabDef } from '../../settings.type';
import { countRows } from '../../SettingsLayout/behavior/count-rows';
import { resolveSections } from '../../SettingsLayout/behavior/resolve-sections';
import type { TabMatches } from '../SettingsHub.type';

const matchTabs = <S extends object>(tabs: readonly TabDef<S>[], settings: S, query: string): TabMatches<S> => {
  const withRows = tabs.flatMap((tab) => {
    const sections = tab.sections?.(settings) ?? [];
    const count = countRows(resolveSections(sections, query));
    return count > 0 ? [{ tab, count }] : [];
  });
  const byName = tabs.filter((tab) => tab.label.toLowerCase().includes(query));
  return { withRows, byName, total: withRows.reduce((sum, m) => sum + m.count, 0) };
};

export { matchTabs };
