/* @layer renderer-shell @kind component */
import { detectHost } from '@drizztdourden08/brock-core';
import { Box } from '@drizztdourden08/tessera/primitives';
import { readDisplaySettings } from '../read-display-settings';
import { RefreshRateSection } from './sub-components/RefreshRateSection';
import { WindowModeSection } from './sub-components/WindowModeSection';
import type { DisplaySettingsTabProps } from './DisplaySettingsTab.type';
import './DisplaySettingsTab.css';

const DisplaySettingsTab = (props: DisplaySettingsTabProps) => {
  const { settings, onChange } = props;
  const display = readDisplaySettings(settings);
  const hasWindow = detectHost() !== 'capacitor';

  return (
    <Box className="display-tab">
      {hasWindow ? <WindowModeSection settings={display} onChange={onChange} /> : null}
      <RefreshRateSection settings={display} onChange={onChange} />
    </Box>
  );
};

export { DisplaySettingsTab };
