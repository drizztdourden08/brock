/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { ScreenPage } from '@drizztdourden08/tessera/composites';
import { SettingsPageContext } from '../../../../settings/SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../../../settings/SettingsLayout/SettingsLayout.type';
import type { HubPageFrameProps } from './HubPageFrame.type';

const HubPageFrame = (props: HubPageFrameProps) => {
  const { page, children } = props;
  const settingsPage = useMemo<SettingsPageContextValue>(() => ({ variant: 'page', icon: page.icon, title: page.label, query: '' }), [page]);
  if (page.fullBleed === true) return children;
  if (page.settingsTab !== undefined) return <SettingsPageContext.Provider value={settingsPage}>{children}</SettingsPageContext.Provider>;
  return <ScreenPage icon={page.icon} title={page.label}>{children}</ScreenPage>;
};

export { HubPageFrame };
