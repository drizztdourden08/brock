/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ScreenPage, SettingsPage } from '@drizztdourden08/tessera/composites';
import { SettingsPageContext } from '../../../../settings/SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../../../settings/SettingsLayout/SettingsLayout.type';
import { PageActionsContext } from '../../../page-actions-context';
import { useHeaderActions } from '../../behavior/useHeaderActions';
import type { HubPageFrameProps } from './HubPageFrame.type';

const HubPageFrame = (props: HubPageFrameProps) => {
  const { page, tab, sub, route, onSelectTab, onUp, children } = props;
  const [slotted, setSlotted] = useState<ReactNode>(null);
  const actions = useHeaderActions(sub ? sub.header : page.header, route, slotted);
  const settingsPage = useMemo<SettingsPageContextValue>(() => ({ variant: 'page', icon: page.icon, title: page.label, query: '' }), [page]);
  const tabs = useMemo(() => (page.tabs && page.tabs.length > 0
    ? { items: page.tabs.map((entry) => ({ id: entry.id, label: entry.label })), activeId: tab?.id ?? page.tabs[0]?.id ?? '', onSelect: onSelectTab }
    : undefined), [page.tabs, tab, onSelectTab]);
  const body = <PageActionsContext.Provider value={setSlotted}>{children}</PageActionsContext.Provider>;
  const scroll = (sub ?? page).fill !== true;
  if (sub) {
    return <ScreenPage icon={sub.icon} title={sub.label} back={{ label: page.label, onSelect: onUp }} actions={actions} scroll={scroll}>{body}</ScreenPage>;
  }
  if (page.fullBleed === true) return body;
  if (page.settingsTab !== undefined) return <SettingsPageContext.Provider value={settingsPage}>{body}</SettingsPageContext.Provider>;
  if (tabs) return <SettingsPage icon={page.icon} title={page.label} tabs={tabs} actions={actions} scroll={scroll}>{body}</SettingsPage>;
  return <ScreenPage icon={page.icon} title={page.label} actions={actions} scroll={scroll}>{body}</ScreenPage>;
};

export { HubPageFrame };
