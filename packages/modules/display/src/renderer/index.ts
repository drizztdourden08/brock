/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { DISPLAY_SETTINGS_TAB } from './display-tab.constants';
import { DisplayProvider } from './DisplayProvider';

const displayRenderer: RendererModule = {
  id: 'display',
  settingsTabs: [DISPLAY_SETTINGS_TAB],
  Provider: DisplayProvider,
};

export default displayRenderer;
export { displayRenderer, DISPLAY_SETTINGS_TAB, DisplayProvider };
export { displayApi } from './display-api';
export { measureRefreshRate } from './measure-refresh-rate';
export { readDisplaySettings } from './read-display-settings';
export { useRefreshRate } from './useRefreshRate';
export { useRefreshRateStore } from './useRefreshRateStore';
export type { RefreshRateState } from './refresh-rate-store.type';
export { useDisplayStore } from './useDisplayStore';
export type { DisplayState } from './display-store.type';
export { DisplaySettingsTab } from './DisplaySettingsTab';
export type { DisplaySettingsTabProps } from './DisplaySettingsTab';
export type {
  DisplayApi, DisplaySettings, MonitorInfo, RefreshRateInfo, SyncedRateStatus, WindowModeState,
} from '../display.type';
