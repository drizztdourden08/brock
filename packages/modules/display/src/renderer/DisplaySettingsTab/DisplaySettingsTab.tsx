/* @layer renderer-shell @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { readDisplaySettings } from '../read-display-settings';
import { RefreshRateSection } from './sub-components/RefreshRateSection';
import { WindowModeSection } from './sub-components/WindowModeSection';
import type { DisplaySettingsTabProps } from './DisplaySettingsTab.type';
import './DisplaySettingsTab.css';

const DisplaySettingsTab = (props: DisplaySettingsTabProps) => {
  const { settings, onChange } = props;
  const display = readDisplaySettings(settings);

  return (
    <Stack gap="lg" className="display-tab">
      <WindowModeSection settings={display} onChange={onChange} />
      <RefreshRateSection settings={display} onChange={onChange} />
    </Stack>
  );
};

export { DisplaySettingsTab };
