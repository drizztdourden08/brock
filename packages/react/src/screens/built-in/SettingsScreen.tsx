/* @layer renderer-shell @kind component */
import { SettingsHub } from '../../settings/SettingsHub/SettingsHub';
import { useSettings } from '../../stores/useSettings';
import { useBrock } from '../../app/useBrock';
import { defineScreen } from '../define-screen';

const SettingsScreenBody = () => {
  const { tabs, settingsControls } = useBrock();
  const { settings, patch } = useSettings<object>();
  return <SettingsHub tabs={tabs} settings={settings} onChange={patch} {...settingsControls} />;
};

const settingsScreen = defineScreen({
  id: 'settings',
  title: 'Settings',
  shortcut: 'Mod+Comma',
  keepMounted: true,
  subtitle: (ctx) => ctx.profile?.name,
  render: () => <SettingsScreenBody />,
});

export { settingsScreen };
