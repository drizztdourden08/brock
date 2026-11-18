/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../../i18n/fallback-text';
import type { TabDef } from '../../settings.type';
import { tabSections } from '../../tab-sections';
import { countRows } from '../../SettingsLayout/behavior/count-rows';
import { resolveSections } from '../../SettingsLayout/behavior/resolve-sections';
import type { TabMatches } from '../SettingsHub.type';

const matchTabs = <S extends object>(tabs: readonly TabDef<S>[], settings: S, query: string, text: (value: Text) => string = fallbackText): TabMatches<S> => {
  const withRows = tabs.flatMap((tab) => {
    const count = countRows(resolveSections(tabSections(tab, settings, text), query, settings));
    return count > 0 ? [{ tab, count }] : [];
  });
  const byName = tabs.filter((tab) => text(tab.label).toLowerCase().includes(query));
  return { withRows, byName, total: withRows.reduce((sum, m) => sum + m.count, 0) };
};

export { matchTabs };
