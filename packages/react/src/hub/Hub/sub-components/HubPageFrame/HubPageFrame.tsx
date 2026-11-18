/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ScreenPage, SettingsPage } from '@drizztdourden08/tessera/composites';
import { useText } from '../../../../i18n';
import { LazyHost } from '../../../../lazy/LazyHost';
import { SettingsPageContext } from '../../../../settings/SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../../../settings/SettingsLayout/SettingsLayout.type';
import { PageActionsContext } from '../../../page-actions-context';
import { backdropNode } from '../../behavior/backdrop-node';
import { compactHeader } from '../../behavior/compact-header';
import { showsPageHeader } from '../../behavior/shows-page-header';
import { useHeaderActions } from '../../behavior/useHeaderActions';
import { HubBarePage } from '../HubBarePage';
import { HubPlainPage } from '../HubPlainPage';
import type { HubPageFrameProps } from './HubPageFrame.type';

const HubPageFrame = (props: HubPageFrameProps) => {
  const { page, tab, sub, route, backdrop: spec, bare = false, onSelectTab, onUp, children } = props;
  const text = useText();
  const [slotted, setSlotted] = useState<ReactNode>(null);
  const actions = useHeaderActions(sub ? sub.header : page.header, route, slotted);
  const backdrop = useMemo(() => backdropNode(spec), [spec]);
  const title = text(page.label);
  const settingsPage = useMemo<SettingsPageContextValue>(() => ({ variant: 'page', icon: page.icon, title, backdrop, query: '' }), [page, title, backdrop]);
  const tabs = useMemo(() => (page.tabs && page.tabs.length > 0
    ? { items: page.tabs.map((entry) => ({ id: entry.id, label: text(entry.label) })), activeId: tab?.id ?? page.tabs[0]?.id ?? '', onSelect: onSelectTab }
    : undefined), [page.tabs, tab, onSelectTab, text]);
  const body = <PageActionsContext.Provider value={setSlotted}><LazyHost>{children}</LazyHost></PageActionsContext.Provider>;
  const scroll = (sub ?? page).fill !== true;
  if (sub) {
    return <ScreenPage icon={sub.icon} title={text(sub.label)} back={{ label: title, onSelect: onUp }} backdrop={backdrop} actions={actions} scroll={scroll}>{body}</ScreenPage>;
  }
  if (page.fullBleed === true) return body;
  if (page.settingsTab !== undefined) return <SettingsPageContext.Provider value={settingsPage}>{body}</SettingsPageContext.Provider>;
  if (bare) return <HubBarePage label={title}>{body}</HubBarePage>;
  if (tabs) return <SettingsPage icon={page.icon} title={title} tabs={tabs} backdrop={backdrop} actions={actions} scroll={scroll}>{body}</SettingsPage>;
  if (!showsPageHeader(page)) return <HubPlainPage label={title} scroll={scroll}>{body}</HubPlainPage>;
  return <ScreenPage icon={page.icon} title={title} backdrop={backdrop} actions={actions} scroll={scroll} compact={compactHeader(page)}>{body}</ScreenPage>;
};

export { HubPageFrame };
