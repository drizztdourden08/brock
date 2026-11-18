/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { useT, useText } from '../../../../i18n';
import { liveTabGroup } from '../../behavior/live-tab-group';
import { matchTabs } from '../../behavior/match-tabs';
import type { HubSearchResultsProps } from './HubSearchResults.type';
import { BrandSearchResults } from '../../../../search/BrandSearchResults';

const HubSearchResults = <S extends object>(props: HubSearchResultsProps<S>) => {
  const { tabs, query, onOpenTab, ...control } = props;
  const text = useText();
  const t = useT();
  const shown = query.trim();
  const normalized = shown.toLowerCase();
  const matches = useMemo(() => matchTabs(tabs, control.settings, normalized, text), [tabs, control.settings, normalized, text]);

  const groups = matches.withRows.map(({ tab, count }) => liveTabGroup({ tab, count, query: normalized, control }));

  return (
    <BrandSearchResults
      query={query}
      count={matches.total}
      summary={t('brock-settings:hub.search.summary', { count: matches.total, query: shown })}
      jumps={matches.byName.map((tab) => ({ id: tab.id, label: tab.label, icon: tab.navIcon }))}
      onJump={onOpenTab}
      groups={groups}
      onOpenGroup={onOpenTab}
      idleMessage={t('brock-settings:hub.search.idle')}
      emptyMessage={t('brock-settings:hub.search.empty', { query: shown })}
    />
  );
};

export { HubSearchResults };
