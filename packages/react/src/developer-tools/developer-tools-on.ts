/* @layer renderer-shell @kind logic */
import { controlSources } from '../app/control-sources';
import { getPlatform } from '../platform/get-platform';
import { useDeveloperToolsStore } from './useDeveloperToolsStore';

const developerToolsOn = (): boolean => {
  const { binding, on } = useDeveloperToolsStore.getState();
  if (binding !== null) return on;
  const enabled = (controlSources.get().settings?.getState().settings as Record<string, unknown> | undefined)?.developerToolsEnabled;
  return getPlatform().info.isDev || enabled === true;
};

export { developerToolsOn };
