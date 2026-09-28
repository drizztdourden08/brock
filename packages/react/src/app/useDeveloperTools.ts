/* @layer renderer-shell @kind hook */
import { usePlatform } from '../platform/usePlatform';
import { useSettingValue } from '../stores/useSettingValue';

const useDeveloperTools = (): boolean => {
  const { info } = usePlatform();
  const enabled = useSettingValue('developerToolsEnabled');
  return info.isDev || enabled === true;
};

export { useDeveloperTools };
