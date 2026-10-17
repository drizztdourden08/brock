/* @layer renderer-shell @kind hook */
import { useDeveloperToolsStore } from '../developer-tools/useDeveloperToolsStore';
import { usePlatform } from '../platform/usePlatform';
import { useSettingValue } from '../stores/useSettingValue';

const useDeveloperTools = (): boolean => {
  const { info } = usePlatform();
  const enabled = useSettingValue('developerToolsEnabled');
  const bound = useDeveloperToolsStore((s) => s.binding !== null);
  const on = useDeveloperToolsStore((s) => s.on);
  if (bound) return on;
  return info.isDev || enabled === true;
};

export { useDeveloperTools };
