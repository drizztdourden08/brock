/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { ProfileTag } from './sub-components/ProfileTag';
import { SettingsSaveStatus } from './sub-components/SettingsSaveStatus';
import './ScreenSubtitle.css';

const ScreenSubtitle = () => (
  <Box as="span" className="screen-subtitle">
    <ProfileTag />
    <SettingsSaveStatus />
  </Box>
);

export { ScreenSubtitle };
