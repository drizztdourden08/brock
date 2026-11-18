/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { SettingsTabPage } from './SettingsTabPage';
import type { HubPage } from './hub.type';

const settingsTabPage = (tab: { id: string; label: Text; navIcon?: ReactNode }, icon?: ReactNode): HubPage => ({
  id: tab.id,
  label: tab.label,
  icon: icon ?? tab.navIcon,
  settingsTab: tab.id,
  render: () => createElement(SettingsTabPage, { tabId: tab.id }),
});

export { settingsTabPage };
