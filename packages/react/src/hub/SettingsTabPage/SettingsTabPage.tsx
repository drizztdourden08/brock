/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../i18n';
import { useBrock } from '../../app/useBrock';
import { useSettings } from '../../stores/useSettings';
import { HubTabContent } from '../../settings/SettingsHub/sub-components/HubTabContent';
import type { SettingsTabPageProps } from './SettingsTabPage.type';

const SettingsTabPage = (props: SettingsTabPageProps) => {
  const { tabId } = props;
  const t = useT();
  const { tabs, settingsControls } = useBrock();
  const { settings, patch } = useSettings<object>();
  const tab = tabs.find((candidate) => candidate.id === tabId);
  if (!tab) return <Text variant="caption">{t('brock-app:hub.tabMissing', { tabId })}</Text>;
  return <HubTabContent tab={tab} settings={settings} onChange={patch} {...settingsControls} />;
};

export { SettingsTabPage };
