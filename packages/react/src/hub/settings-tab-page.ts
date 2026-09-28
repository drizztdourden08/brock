/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { SettingsTabPage } from './SettingsTabPage';
import type { HubPage } from './hub.type';

const settingsTabPage = (tab: { id: string; label: string; navIcon?: ReactNode }, icon?: ReactNode): HubPage => ({
  id: tab.id,
  label: tab.label,
  icon: icon ?? tab.navIcon,
  render: () => createElement(SettingsTabPage, { tabId: tab.id }),
});

export { settingsTabPage };
