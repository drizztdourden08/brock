/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { ScreenPage, SettingsPage } from '@drizztdourden08/tessera/composites';
import { SettingsPageContext } from '../../../../settings/SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../../../settings/SettingsLayout/SettingsLayout.type';
import type { HubPageFrameProps } from './HubPageFrame.type';

const HubPageFrame = (props: HubPageFrameProps) => {
  const { page, tab, onSelectTab, children } = props;
  const settingsPage = useMemo<SettingsPageContextValue>(() => ({ variant: 'page', icon: page.icon, title: page.label, query: '' }), [page]);
  const tabs = useMemo(() => (page.tabs && page.tabs.length > 0
    ? { items: page.tabs.map((entry) => ({ id: entry.id, label: entry.label })), activeId: tab?.id ?? page.tabs[0]?.id ?? '', onSelect: onSelectTab }
    : undefined), [page.tabs, tab, onSelectTab]);
  if (page.fullBleed === true) return children;
  if (page.settingsTab !== undefined) return <SettingsPageContext.Provider value={settingsPage}>{children}</SettingsPageContext.Provider>;
  if (tabs) return <SettingsPage icon={page.icon} title={page.label} tabs={tabs}>{children}</SettingsPage>;
  return <ScreenPage icon={page.icon} title={page.label}>{children}</ScreenPage>;
};

export { HubPageFrame };
