/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { ScreenParams } from '../../navigation/navigation.type';
import { SettingsHub } from '../../settings/SettingsHub/SettingsHub';
import { useSettings } from '../../stores/useSettings';
import { useBrock } from '../../app/useBrock';
import { defineScreen } from '../define-screen';

const requestedTab = (params: ScreenParams): string | undefined => (typeof params.tab === 'string' ? params.tab : undefined);

const SettingsScreenBody = (props: { params: ScreenParams }) => {
  const { params } = props;
  const { tabs, settingsControls } = useBrock();
  const { settings, patch } = useSettings<object>();
  const [request, setRequest] = useState(params);
  const [active, setActive] = useState(requestedTab(params));
  if (params !== request) {
    setRequest(params);
    const tab = requestedTab(params);
    if (tab) setActive(tab);
  }
  return <SettingsHub tabs={tabs} settings={settings} onChange={patch} activeTab={active} onTabChange={setActive} {...settingsControls} />;
};

const settingsScreen = defineScreen({
  id: 'settings',
  title: 'Settings',
  icon: <Icon name="settings" />,
  header: 'own',
  shortcut: 'Mod+Comma',
  keepMounted: true,
  subtitle: (ctx) => ctx.profile?.name,
  render: (ctx) => <SettingsScreenBody params={ctx.params} />,
});

export { settingsScreen };
