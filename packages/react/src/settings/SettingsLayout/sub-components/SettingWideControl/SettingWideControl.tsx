/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { SettingWideControlProps } from './SettingWideControl.type';
import './SettingWideControl.css';

const SettingWideControl = (props: SettingWideControlProps) => <Box className="setting-wide-control">{props.children}</Box>;

export { SettingWideControl };
